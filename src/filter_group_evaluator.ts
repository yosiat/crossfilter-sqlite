import FilterMap from './filters/storage';
import SqlConnectionInformation from './sql_connection_information';
import * as sqlite3 from 'sqlite3';
import * as squel from 'squel';
import * as _ from 'lodash';
import * as Promise from 'bluebird';

export default class FilterGroupEvaluator<T> {

  sqlConnectionInformation: SqlConnectionInformation;

  // The column name we grouping based on
  columnName: string;


  constructor(columnName: string,
              sqlConnectionInformation: SqlConnectionInformation) {
    this.columnName = columnName;
    this.sqlConnectionInformation = sqlConnectionInformation;
  }


  private buildFilterSql(filters: FilterMap) : string {
    return squel.select()
         .field(this.columnName, "key")
         .field("COUNT(*)", "value")
         .from(this.sqlConnectionInformation.tableName)
         .where(_.map(filters, (filter,name) => filter.toSqlLogicalOperation(name)).join(' AND '))
         .group(this.columnName)
         .toString();
  }


  private executeSql(sql: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      // TODO: close the connection!
      var conn = this.sqlConnectionInformation.createConnection();
      conn.all(sql, (err, values) => {
        if(err !== null) {
          reject(err);
        } else {
          resolve(values);
        }
      });
    });
  }

  evaluate(filters : FilterMap) : Promise<T> {
    return this.executeSql(this.buildFilterSql(filters));
  }

}

