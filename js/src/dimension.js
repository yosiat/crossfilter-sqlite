/// <reference path="../typings/crossfilter/crossfilter.d.ts" />
var builder_1 = require('./filters/builder');
var filter_group_evaluator_1 = require('./filter_group_evaluator');
var _ = require('lodash');
var Promise = require('bluebird');
var SqlCrossfilter = (function () {
    function SqlCrossfilter(connectionInformation) {
        this.filterStore = new builder_1.default();
        this.sqlConnectionInfo = connectionInformation;
        this.dimensions = [];
    }
    SqlCrossfilter.prototype.dimension = function (columName) {
        var dimension = new SqlDimension(columName, this.filterStore, this.sqlConnectionInfo);
        this.dimensions.push(dimension);
        return dimension;
    };
    SqlCrossfilter.prototype.evaluateAll = function () {
        return Promise.map(this.dimensions, function (d) { return d.evaluate(); });
    };
    SqlCrossfilter.prototype.dump = function () {
        console.log("");
        console.log("------------------------");
        this.filterStore.dump();
    };
    return SqlCrossfilter;
})();
exports.SqlCrossfilter = SqlCrossfilter;
var SqlDimension = (function () {
    function SqlDimension(name, filterStore, sqlConnectionInfo) {
        this.name = name;
        this.filterStore = filterStore;
        this.filterGroupEvaluator = new filter_group_evaluator_1.default(this.name, sqlConnectionInfo);
        this.lastResults = [];
        this.defaultResults = {};
        this.defaultResultsBuilt = false;
    }
    SqlDimension.prototype.filter = function (range) {
        if (range == null) {
            return this.filterAll();
        }
        if (_.isArray(range)) {
            return this.filterRange(range);
        }
        if (_.isFunction(range)) {
            return this.filterFunction(range);
        }
        return this.filterExact(range);
    };
    SqlDimension.prototype.filterExact = function (value) {
        this.filterStore.addExactFilter(this.name, value);
        return this;
    };
    SqlDimension.prototype.filterRange = function (value) {
        this.filterStore.addRangeFilter(this.name, value);
        return this;
    };
    SqlDimension.prototype.filterFunction = function (value) {
        var _this = this;
        console.log("[ " + this.name + "] filter by function");
        var fn = function (filter) {
            var shouldAddFilter = value(filter);
            shouldAddFilter && _this.filterStore.addExactFilter(_this.name, value);
            return shouldAddFilter;
        };
        return this;
    };
    SqlDimension.prototype.filterAll = function () {
        console.log("[" + this.name + "] filterAll is called");
        this.filterStore.clearFilters(this.name);
        return this;
    };
    SqlDimension.prototype.top = function (k) {
        console.log("[" + this.name + "] top is called with", k);
        return [];
    };
    SqlDimension.prototype.bottom = function (k) {
        console.log("[" + this.name + "] bottom is called with", k);
        return [];
    };
    SqlDimension.prototype.dispose = function () {
    };
    SqlDimension.prototype.group = function (groupValue) {
        var results = this.lastResults;
        return {
            all: function () { return results; }
        };
    };
    SqlDimension.prototype.buildGroup = function (results) {
        if (!this.defaultResultsBuilt) {
            this.defaultResults = _.transform(results, function (defaults, pair) { return defaults[pair.key] = 0; });
            this.defaultResultsBuilt = true;
        }
        this.lastResults = _.chain(results)
            .transform(function (newResults, pair) { return newResults[pair.key] = pair.value; })
            .defaults(this.defaultResults)
            .pairs()
            .map(function (pair) { return { key: pair[0], value: pair[1] }; })
            .value();
    };
    SqlDimension.prototype.evaluate = function () {
        var filters = this.filterStore.filtersExcept(this.name);
        var evaluateTask = this.filterGroupEvaluator.evaluate(filters);
        evaluateTask.then(this.buildGroup.bind(this));
        return evaluateTask;
    };
    SqlDimension.prototype.groupAll = function () {
        console.log("[" + this.name + "] groupAll is called");
        return null;
    };
    return SqlDimension;
})();
exports.SqlDimension = SqlDimension;
