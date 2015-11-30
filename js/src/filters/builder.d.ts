import { FilterMap } from './storage';
import RangeFilterStorage from './range';
import ValuesFilterStorage from './value';
export default class FiltersStore {
    rangeFilters: RangeFilterStorage;
    valueFilters: ValuesFilterStorage;
    constructor();
    addRangeFilter(name: string, range: any[]): void;
    addExactFilter(name: string, filter: any): void;
    clearFilters(name: string): void;
    filtersExcept(columnName: string): FilterMap;
    dump(): void;
}
