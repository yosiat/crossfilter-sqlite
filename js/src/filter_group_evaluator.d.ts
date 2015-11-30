import FilterMap from './filters/storage';
import SqlConnectionInformation from './sql_connection_information';
import * as Promise from 'bluebird';
export default class FilterGroupEvaluator<T> {
    sqlConnectionInformation: SqlConnectionInformation;
    columnName: string;
    constructor(columnName: string, sqlConnectionInformation: SqlConnectionInformation);
    private buildFilterSql(filters);
    private executeSql(sql);
    evaluate(filters: FilterMap): Promise<T>;
}
