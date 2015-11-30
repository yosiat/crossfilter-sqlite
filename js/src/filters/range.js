var _ = require('lodash');
var RangeFilter = (function () {
    function RangeFilter(start, end) {
        this.start = start;
        this.end = end;
    }
    RangeFilter.prototype.toSqlLogicalOperation = function (columnName) {
        return columnName + " BETWEEN " + this.start + " AND " + this.end;
    };
    return RangeFilter;
})();
var RangeFilterStorage = (function () {
    function RangeFilterStorage() {
        this.ranges = {};
    }
    RangeFilterStorage.prototype.reset = function (name) {
        delete this.ranges[name];
    };
    RangeFilterStorage.prototype.filterBy = function (name, filter) {
        this.ranges[name] = new RangeFilter(filter[0], filter[1]);
    };
    RangeFilterStorage.prototype.allFilters = function () {
        return this.ranges;
    };
    return RangeFilterStorage;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RangeFilterStorage;
