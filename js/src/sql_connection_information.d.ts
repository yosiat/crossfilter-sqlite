export declare class SqlConnectionInformation {
    dbFile: string;
    tableName: string;
    constructor(dbFile: string, tableName: string);
    createConnection(): any;
}
