import Filter from './filter';


export interface FilterMap {
  [name: string]: Filter;
}


interface FilterStorage {
  
  reset(name: string);
  
  filterBy(name: string, filter: any) : void;

  allFilters(): FilterMap; 

}

export default FilterStorage;
