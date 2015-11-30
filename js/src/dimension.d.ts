/// <reference path="../../ts/typings/crossfilter/crossfilter.d.ts" />
import FilterStore from './filters/builder';
import FilterGroupEvaluator from './filter_group_evaluator';
import SqlConnectionInformation from './sql_connection_information';
import * as Promise from 'bluebird';
export declare class SqlCrossfilter<T> {
    filterStore: FilterStore;
    sqlConnectionInfo: SqlConnectionInformation;
    dimensions: any[];
    constructor(connectionInformation: SqlConnectionInformation);
    dimension<TColumnType>(columName: string): SqlDimension<T, TColumnType>;
    evaluateAll(): Promise;
    dump(): void;
}
export declare class SqlDimension<T, TDimension> implements CrossFilter.Dimension<T, TDimension> {
    filterStore: FilterStore;
    filterGroupEvaluator: FilterGroupEvaluator<T>;
    name: string;
    lastResults: any[];
    defaultResults: any;
    defaultResultsBuilt: boolean;
    constructor(name: string, filterStore: FilterStore, sqlConnectionInfo: SqlConnectionInformation);
    filter(range: TDimension[]): CrossFilter.Dimension<T, TDimension>;
    filter(range: TDimension): CrossFilter.Dimension<T, TDimension>;
    filter(range: CrossFilter.Selector<TDimension>): CrossFilter.Dimension<T, TDimension>;
    filterExact(value: TDimension): CrossFilter.Dimension<T, TDimension>;
    filterRange(value: TDimension[]): CrossFilter.Dimension<T, TDimension>;
    filterFunction(value: CrossFilter.Selector<TDimension>): CrossFilter.Dimension<T, TDimension>;
    filterAll(): CrossFilter.Dimension<T, TDimension>;
    top(k: number): T[];
    bottom(k: number): T[];
    dispose(): void;
    group(): CrossFilter.Group<T, TDimension, TDimension>;
    private buildGroup(results);
    evaluate(): Promise;
    groupAll(): CrossFilter.GroupAll<T>;
}
