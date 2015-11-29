/// <reference path="../typings/crossfilter/crossfilter.d.ts" />
import FilterStore from './filters/builder'
import FilterMap from './filters/storage';
import FilterGroupEvaluator from './filter_group_evaluator';
import SqlConnectionInformation from './sql_connection_information';

import * as _ from 'lodash';
import * as Promise from 'bluebird';



export class SqlCrossfilter<T> {
  filterStore: FilterStore;
  sqlConnectionInfo: SqlConnectionInformation;

  // TODO: on dimension dispose, remove..
  dimensions: any[];

  
  // TODO: get the connection
  constructor(connectionInformation: SqlConnectionInformation) {
    this.filterStore = new FilterStore();
    this.sqlConnectionInfo = connectionInformation;
    this.dimensions = [];
  }
  
  dimension<TColumnType>(columName: string) : SqlDimension<T, TColumnType> {
    var dimension = new SqlDimension<T, TColumnType>(columName, this.filterStore, this.sqlConnectionInfo);
    this.dimensions.push(dimension);
    return dimension;
  }


  evaluateAll() : Promise {
    return Promise.map(this.dimensions, d => d.evaluate()); 
  }


  dump() : void {
    console.log("");
    console.log("------------------------");
    this.filterStore.dump();
  }
}

export class SqlDimension<T, TDimension> implements CrossFilter.Dimension<T, TDimension> {

  filterStore : FilterStore;
  filterGroupEvaluator: FilterGroupEvaluator<T>;
  name: string;
  lastResults: any[];
  // TODO: create type for Grouping
  defaultResults: any; 
  defaultResultsBuilt: boolean;
  
  constructor(name: string, filterStore: FilterStore, sqlConnectionInfo: SqlConnectionInformation) {
    this.name = name;
    this.filterStore = filterStore;
    this.filterGroupEvaluator = new FilterGroupEvaluator<T>(this.name, sqlConnectionInfo);

    this.lastResults = [];

    this.defaultResults = {};
    this.defaultResultsBuilt = false;
  }
  
  

  /**
   * Filter just calls the appropiate filter:
   *  *) filterAll
   *  *) filterExact
   *  *) filterRange
   *  *) filterFunction
   */
  public filter(range: TDimension[]): CrossFilter.Dimension<T, TDimension>;
  public filter(range: TDimension): CrossFilter.Dimension<T, TDimension>;
  public filter(range: CrossFilter.Selector<TDimension>): CrossFilter.Dimension<T, TDimension>;
  public filter(range: any) : any {
    if(range == null) {
      return this.filterAll(); 
    }
    
    if(_.isArray(range)) {
      return this.filterRange(range);
    }
    
    if(_.isFunction(range)) {
      return this.filterFunction(range);
    }
    
    return this.filterExact(range);
  }
  
  /**
   * filter by exact value
   */
  public filterExact(value: TDimension): CrossFilter.Dimension<T, TDimension> {
    this.filterStore.addExactFilter(this.name, value);
    
    return this;
  }
  
  /**
   * filter by range
   */
  public filterRange(value: TDimension[]): CrossFilter.Dimension<T, TDimension> {
    this.filterStore.addRangeFilter(this.name, value);
    
    return this; 
  }
  
  /**
   * Filter by function
   */
  public filterFunction(value: CrossFilter.Selector<TDimension>): CrossFilter.Dimension<T, TDimension> {
    console.log("[ " + this.name + "] filter by function");
    
    var fn : CrossFilter.Selector<TDimension> = (filter) => {
      var shouldAddFilter : boolean = value(filter);
      
      shouldAddFilter && this.filterStore.addExactFilter(this.name, value);
      
      return shouldAddFilter;
    };
    
    return this;
  }
  
  
  /**
   * Clear the filters.
   */
  public filterAll(): CrossFilter.Dimension<T, TDimension> {
    console.log("[" + this.name + "] filterAll is called");
    this.filterStore.clearFilters(this.name);
    
    return this;  
  }
  
  public top(k: number): T[] {
    console.log("[" + this.name + "] top is called with", k);
    return []; 
  }
  
  public bottom(k: number): T[] {
    console.log("[" + this.name + "] bottom is called with", k);
    return [];
  }
  
  public dispose(): void {
    // TODO: clear the filters
  }
  
  
  public group(): CrossFilter.Group<T, TDimension, TDimension>;
  public group(groupValue?  : (data: TDimension) => TDimension): CrossFilter.Group<T, TDimension, TDimension> {
    var results = this.lastResults;
    // Return constant group..
    return {
      all() { return results; } 
    };
  }


  private buildGroup(results : any[]) : void {
    // ASSUMPTION: we are making an assumption, that the first
    // buildGroup call is without filters.. we can remove this assumption and make allKeys as set,
    // and re-add every buildGroup.
    if(!this.defaultResultsBuilt) {
      this.defaultResults = _.transform(results, (defaults, pair) => defaults[pair.key] = 0);
      this.defaultResultsBuilt = true;
    }


    // We need to combie the results, with the old results..
    this.lastResults = _.chain(results)
      // Build dictionary from the results [key] = value
      .transform((newResults, pair) => newResults[pair.key] = pair.value)
      // Set defaults
      .defaults(this.defaultResults)
      // Transform to array of {key, value}
      .pairs()
      .map(pair => { return { key: pair[0], value: pair[1] } })
      .value();
  }

  public evaluate() : Promise {
    var filters : FilterMap = this.filterStore.filtersExcept(this.name);
    var evaluateTask = this.filterGroupEvaluator.evaluate(filters);

    evaluateTask.then(this.buildGroup.bind(this));

    return evaluateTask;
  }

  public groupAll(): CrossFilter.GroupAll<T> {
    console.log("[" + this.name + "] groupAll is called");
    return null;
  }

}
