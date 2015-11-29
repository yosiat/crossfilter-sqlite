import Filter from './filter';
import {FilterStorage, FilterMap} from './storage';
var _ = require('lodash');

class RangeFilter implements Filter {
  start: any;
  end: any;
  
  constructor(start: any, end: any) {
    this.start = start;
    this.end = end;
  }

  toSqlLogicalOperation(columnName: string) : string {
    return `${columnName} BETWEEN ${this.start} AND ${this.end}`;
  }
}

export default class RangeFilterStorage implements FilterStorage {
  ranges: FilterMap;
  
  constructor() {
    this.ranges = {};
  }
  
  reset(name: string) {
    delete this.ranges[name];
  }
  
  filterBy(name: string, filter: any) : void {
    this.ranges[name] = new RangeFilter(filter[0], filter[1]);
  }

  allFilters() : FilterMap {
    return this.ranges;
  }

}

