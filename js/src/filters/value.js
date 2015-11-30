var _ = require('lodash');
var ValuesFilter = (function () {
    function ValuesFilter() {
        this.values = [];
    }
    ValuesFilter.prototype.add = function (value) {
        if (this.values.indexOf(value) === -1) {
            this.values.push(value);
        }
    };
    ValuesFilter.prototype.toSqlLogicalOperation = function (columnName) {
        var values = _.map(this.values, function (value) { return ("\"" + value + "\""); }).join(',');
        return columnName + " IN (" + values + ")";
    };
    return ValuesFilter;
})();
var ValuesFilterStorage = (function () {
    function ValuesFilterStorage() {
        this.filters = {};
    }
    ValuesFilterStorage.prototype.reset = function (name) {
        delete this.filters[name];
    };
    ValuesFilterStorage.prototype.filterBy = function (name, filter) {
        this.filters[name] = this.filters[name] || new ValuesFilter();
        this.filters[name].add(filter);
    };
    ValuesFilterStorage.prototype.allFilters = function () {
        return this.filters;
    };
    return ValuesFilterStorage;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValuesFilterStorage;
