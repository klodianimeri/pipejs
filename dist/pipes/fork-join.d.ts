import { Operator } from "../pipe.js";
export declare function forkJoin<I, T1>(source1: AsyncIterable<T1>): Operator<I, [I, T1]>;
export declare function forkJoin<I, T1, T2>(source1: AsyncIterable<T1>, source2: AsyncIterable<T2>): Operator<I, [I, T1, T2]>;
export declare function forkJoin<I, T1, T2, T3>(source1: AsyncIterable<T1>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>): Operator<I, [I, T1, T2, T3]>;
export declare function forkJoin<I, T1, T2, T3, T4>(source1: AsyncIterable<T1>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>): Operator<I, [I, T1, T2, T3, T4]>;
export declare function forkJoin<I, T1, T2, T3, T4, T5>(source1: AsyncIterable<T1>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>, source5: AsyncIterable<T5>): Operator<I, [I, T1, T2, T3, T4, T5]>;
export declare function forkJoin<I>(...sources: AsyncIterable<any>[]): Operator<I, any[]>;
