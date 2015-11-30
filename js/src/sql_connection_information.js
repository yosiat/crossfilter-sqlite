var sqlite3 = require('sqlite3');
var SqlConnectionInformation = (function () {
    function SqlConnectionInformation(dbFile, tableName) {
        this.dbFile = dbFile;
        this.tableName = tableName;
    }
    SqlConnectionInformation.prototype.createConnection = function () {
        return new sqlite3.cached.Database(this.dbFile);
    };
    return SqlConnectionInformation;
})();
exports.SqlConnectionInformation = SqlConnectionInformation;
