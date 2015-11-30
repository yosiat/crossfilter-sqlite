import { FilterStorage, FilterMap } from './storage';
export default class RangeFilterStorage implements FilterStorage {
    ranges: FilterMap;
    constructor();
    reset(name: string): void;
    filterBy(name: string, filter: any): void;
    allFilters(): FilterMap;
}
