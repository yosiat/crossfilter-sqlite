interface Filter {
  /*
   * Create a logical operation from the given filter
   * for example, exact values filter given column name 'TYPE'
   * and values 'CLASS': TYPE IN ('CLASS')
   *
   */
  toSqlLogicalOperation(columnName: string) : string;
}


export default Filter;
