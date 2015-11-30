var range_1 = require('./range');
var value_1 = require('./value');
var _ = require('lodash');
var FiltersStore = (function () {
    function FiltersStore() {
        this.rangeFilters = new range_1.default();
        this.valueFilters = new value_1.default();
    }
    FiltersStore.prototype.addRangeFilter = function (name, range) {
        this.rangeFilters.filterBy(name, range);
    };
    FiltersStore.prototype.addExactFilter = function (name, filter) {
        this.valueFilters.filterBy(name, filter);
    };
    FiltersStore.prototype.clearFilters = function (name) {
        this.valueFilters.reset(name);
        this.rangeFilters.reset(name);
    };
    FiltersStore.prototype.filtersExcept = function (columnName) {
        var allFilters = _.merge({}, this.valueFilters.allFilters(), this.rangeFilters.allFilters(), function (v1, v2) {
            if (_.isArray(v1) && _.isArray(v2)) {
                return v1.concat(v2);
            }
        });
        return _.omit(allFilters, columnName);
    };
    FiltersStore.prototype.dump = function () {
        console.log("Value", this.valueFilters.toString());
        console.log("Range", this.rangeFilters.toString());
    };
    return FiltersStore;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FiltersStore;
