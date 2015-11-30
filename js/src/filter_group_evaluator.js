var squel = require('squel');
var _ = require('lodash');
var Promise = require('bluebird');
var FilterGroupEvaluator = (function () {
    function FilterGroupEvaluator(columnName, sqlConnectionInformation) {
        this.columnName = columnName;
        this.sqlConnectionInformation = sqlConnectionInformation;
    }
    FilterGroupEvaluator.prototype.buildFilterSql = function (filters) {
        return squel.select()
            .field(this.columnName, "key")
            .field("COUNT(*)", "value")
            .from(this.sqlConnectionInformation.tableName)
            .where(_.map(filters, function (filter, name) { return filter.toSqlLogicalOperation(name); }).join(' AND '))
            .group(this.columnName)
            .toString();
    };
    FilterGroupEvaluator.prototype.executeSql = function (sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var conn = _this.sqlConnectionInformation.createConnection();
            conn.all(sql, function (err, values) {
                if (err !== null) {
                    reject(err);
                }
                else {
                    resolve(values);
                }
            });
        });
    };
    FilterGroupEvaluator.prototype.evaluate = function (filters) {
        return this.executeSql(this.buildFilterSql(filters));
    };
    return FilterGroupEvaluator;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterGroupEvaluator;
