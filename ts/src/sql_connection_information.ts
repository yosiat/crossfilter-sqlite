import * as sqlite3 from 'sqlite3';

export class SqlConnectionInformation {
    // TODO: switch to real sql connection here
    dbFile: string;
    tableName: string;

    constructor(dbFile: string, tableName: string) {
        this.dbFile = dbFile;
        this.tableName = tableName;
    }

    createConnection() : any {
      return new sqlite3.cached.Database(this.dbFile);
    }
}
