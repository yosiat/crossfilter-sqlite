import { FilterStorage, FilterMap } from './storage';
export default class ValuesFilterStorage implements FilterStorage {
    filters: FilterMap;
    constructor();
    reset(name: string): void;
    filterBy(name: string, filter: any): void;
    allFilters(): FilterMap;
}
