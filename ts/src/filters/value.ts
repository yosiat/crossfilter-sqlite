import Filter from './filter';
import {FilterStorage, FilterMap} from './storage';
var _ = require('lodash');


class ValuesFilter implements Filter {
  values: any[];

  constructor() {
    this.values = [];
  }

  add(value: any) : void {
   if(this.values.indexOf(value) === -1) {
     this.values.push(value);
   }
  }

  toSqlLogicalOperation(columnName: string) : string {
    var values: string = _.map(this.values, (value) => `"${value}"`).join(',');
    return `${columnName} IN (${values})`;  
  }
}


export default class ValuesFilterStorage implements FilterStorage {
  filters: FilterMap;
  
  constructor() {
    this.filters = {};
  }
  
  
  reset(name: string) {
    delete this.filters[name];
  }
  
  filterBy(name: string, filter: any) : void {
    this.filters[name] = this.filters[name] || new ValuesFilter();
    this.filters[name].add(filter);
  }

  allFilters() : FilterMap {
    return this.filters;
  }
}
