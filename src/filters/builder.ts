import {FilterMap} from './storage';
import RangeFilterStorage from './range';
import ValuesFilterStorage from './value';
var _ = require('lodash');

export default class FiltersStore {
  rangeFilters: RangeFilterStorage;
  valueFilters: ValuesFilterStorage;
  
  
  constructor() {
    this.rangeFilters = new RangeFilterStorage();
    this.valueFilters = new ValuesFilterStorage();
  }
  
 
  addRangeFilter(name: string, range: any[]) {
    this.rangeFilters.filterBy(name, range);
  }
  
  addExactFilter(name: string, filter : any) {
    this.valueFilters.filterBy(name, filter);
  }
  
  clearFilters(name: string) {
    this.valueFilters.reset(name);
    this.rangeFilters.reset(name);
  }

  filtersExcept(columnName: string) : FilterMap {
    var allFilters : FilterMap =  _.merge(
            {},
            this.valueFilters.allFilters(),
            this.rangeFilters.allFilters(),
            (v1, v2) => {
                if(_.isArray(v1) && _.isArray(v2)) {
                    return v1.concat(v2);
                }
            });

    return _.omit(allFilters, columnName);
  }


  
  dump() {
    console.log("Value", this.valueFilters.toString());
    console.log("Range", this.rangeFilters.toString());
  }
  
  
}

