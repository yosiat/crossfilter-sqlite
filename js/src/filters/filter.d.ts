interface Filter {
    toSqlLogicalOperation(columnName: string): string;
}
export default Filter;
