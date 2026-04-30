type PipeIteratorResult<T = any, TReturn = any> = IteratorResult<T, TReturn> | Array<IteratorResult<T, TReturn>> | undefined;
type PipeIterator<I = any, T = any, TReturn = any> = (value: IteratorResult<I, TReturn>) => PipeIteratorResult<T, TReturn>;
type Pipe<I = any, T = I, TReturn = any> = () => PipeIterator<I, T, TReturn>;

declare function pipeSync<TSource, T1>(source: Iterable<TSource>): Iterable<TSource>;
declare function pipeSync<TSource, T1>(source: Iterable<TSource>, p1: Pipe<TSource, T1>): Iterable<T1>;
declare function pipeSync<TSource, T1, T2>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>): Iterable<T2>;
declare function pipeSync<TSource, T1, T2, T3>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>): Iterable<T3>;
declare function pipeSync<TSource, T1, T2, T3, T4>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>): Iterable<T4>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>): Iterable<T5>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5, T6>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>): Iterable<T6>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>): Iterable<T7>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>): Iterable<T8>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>, p9: Pipe<T8, T9>): Iterable<T9>;
declare function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(source: Iterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>, p9: Pipe<T8, T9>, p10: Pipe<T9, T10>): Iterable<T10>;
declare function pipeSync(source: Iterable<any>, ...pipes: Array<Pipe<any, any>>): Iterable<any>;

declare function pipeAsync<TSource, T1>(source: AsyncIterable<TSource>): AsyncIterable<TSource>;
declare function pipeAsync<TSource, T1>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>): AsyncIterable<T1>;
declare function pipeAsync<TSource, T1, T2>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>): AsyncIterable<T2>;
declare function pipeAsync<TSource, T1, T2, T3>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>): AsyncIterable<T3>;
declare function pipeAsync<TSource, T1, T2, T3, T4>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>): AsyncIterable<T4>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>): AsyncIterable<T5>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5, T6>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>): AsyncIterable<T6>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>): AsyncIterable<T7>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>): AsyncIterable<T8>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>, p9: Pipe<T8, T9>): AsyncIterable<T9>;
declare function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(source: AsyncIterable<TSource>, p1: Pipe<TSource, T1>, p2: Pipe<T1, T2>, p3: Pipe<T2, T3>, p4: Pipe<T3, T4>, p5: Pipe<T4, T5>, p6: Pipe<T5, T6>, p7: Pipe<T6, T7>, p8: Pipe<T7, T8>, p9: Pipe<T8, T9>, p10: Pipe<T9, T10>): AsyncIterable<T10>;
declare function pipeAsync(source: AsyncIterable<any>, ...pipes: Array<Pipe<any, any>>): AsyncIterable<any>;

declare function at<I>(index: number): Pipe<I, I>;

declare function average<I>(): Pipe<I, number>;

declare function bufferCount<I>(count: number, every?: number): Pipe<I, I[]>;

declare function concat<I, T1>(source1: Iterable<T1>): Pipe<I, I | T1>;
declare function concat<I, T1, T2>(source1: Iterable<T1>, source2: Iterable<T2>): Pipe<I, I | T1 | T2>;
declare function concat<I, T1, T2, T3>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>): Pipe<I, I | T1 | T2 | T3>;
declare function concat<I, T1, T2, T3, T4>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>): Pipe<I, I | T1 | T2 | T3 | T4>;
declare function concat<I, T1, T2, T3, T4, T5>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>, source5: Iterable<T5>): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;

declare function count<I>(): Pipe<I, number>;

declare function defaultIfEmpty<I, T>(value: T): Pipe<I, I | T>;

declare function difference<I>(...sources: Array<Iterable<any>>): Pipe<I, I>;

declare function distinctUntilChanged<I>(comparator?: (previous: I, current: I) => boolean): Pipe<I, I>;

declare function distinctUntilKeyChanged<I extends Record<string, any>, K extends keyof I>(key: K, comparator?: (previous: I[K], current: I[K]) => boolean): Pipe<I, I>;

declare function distinct<I, K = I>(keyselector?: (element: I) => K): Pipe<I, I>;

declare function drop<I>(count: number): Pipe<I, I>;

declare const elementAt: typeof at;

declare function entries<I>(): Pipe<I, [number, I]>;

declare function endWith<I, T>(...elements: Array<T>): Pipe<I, I | T>;

declare function every<I>(predicate: (element: I, index: number) => boolean): Pipe<I, boolean>;

declare function fill<I, T>(value: T, start?: number, end?: number): Pipe<I, I | T>;

declare function filter<I>(predicate: (element: I, index: number) => boolean): Pipe<I, I>;

declare function findIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Pipe<I, number>;

declare function findLastIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Pipe<I, number>;

declare function findLast<I>(predicate: (element: I, index: number) => boolean): Pipe<I, I>;

declare function find<I>(predicate: (element: I, index: number) => boolean): Pipe<I, I>;

declare function first<I>(): Pipe<I, I>;

declare function flat<I>(depth?: number): Pipe<I, any>;

declare function ignoreElements<I>(): Pipe<I, never>;

declare function includes<I>(value: I, fromIndex?: number): Pipe<I, boolean>;

declare function indexOf<I>(value: I, fromIndex?: number): Pipe<I, number>;

declare function intersection<I, T1>(source1: Iterable<T1>): Pipe<I, I | T1>;
declare function intersection<I, T1, T2>(source1: Iterable<T1>, source2: Iterable<T2>): Pipe<I, I | T1 | T2>;
declare function intersection<I, T1, T2, T3>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>): Pipe<I, I | T1 | T2 | T3>;
declare function intersection<I, T1, T2, T3, T4>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>): Pipe<I, I | T1 | T2 | T3 | T4>;
declare function intersection<I, T1, T2, T3, T4, T5>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>, source5: Iterable<T5>): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;
declare function intersection<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any>;

declare function isDisjointFrom<I>(...sources: Array<Iterable<any>>): Pipe<I, boolean>;

declare function isEmpty<I>(): Pipe<I, boolean>;

declare function isSubsetOf<I>(...sources: Array<Iterable<any>>): Pipe<I, boolean>;

declare function isSupersetOf<I>(...sources: Array<Iterable<any>>): Pipe<I, boolean>;

declare function keys<I>(): Pipe<I, I extends [infer K, any] ? K : number>;

declare const lastIndexOf: (value: any, fromIndex?: number) => Pipe<unknown, number>;

declare function last<T>(): Pipe<T, T>;

declare function mapTo<I, T>(value: T): Pipe<I, T>;

declare function map<I, T>(callbackFn: (element: I, index: number) => T): Pipe<I, T>;

declare function max(): Pipe<number, number>;

declare function min(): Pipe<number, number>;

declare function pop<I>(): Pipe<I, I>;

declare function reduce<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Pipe<I, T>;

declare function reverse<I>(): Pipe<I, I>;

declare function scan<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Pipe<I, T>;

declare function size<I>(): Pipe<I, number>;

declare function skipLast<I>(count: number): Pipe<I, I>;

declare const skip: typeof drop;

declare function slice<I>(start: number, end?: number): Pipe<I, I>;

declare function some<I>(predicate: (element: I, index: number) => boolean): Pipe<I, boolean>;

declare function splice<I, T>(start: number, deleteCount: number, ...elements: Array<T>): Pipe<I, I | T>;

declare function startWith<I, T>(...elements: Array<T>): Pipe<I, I | T>;

declare function sum<I>(): Pipe<I, number>;

declare function symmetricDifference<I, T1>(source1: Iterable<T1>): Pipe<I, I | T1>;
declare function symmetricDifference<I, T1, T2>(source1: Iterable<T1>, source2: Iterable<T2>): Pipe<I, I | T1 | T2>;
declare function symmetricDifference<I, T1, T2, T3>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>): Pipe<I, I | T1 | T2 | T3>;
declare function symmetricDifference<I, T1, T2, T3, T4>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>): Pipe<I, I | T1 | T2 | T3 | T4>;
declare function symmetricDifference<I, T1, T2, T3, T4, T5>(source1: Iterable<T1>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>, source5: Iterable<T5>): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;
declare function symmetricDifference<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any>;

declare function takeLast<I>(count: number): Pipe<I, I>;

declare function takeWhile<I>(predicate: (element: I, index: number) => boolean, inclusive?: boolean): Pipe<I, I>;

declare function take<I>(count: number): Pipe<I, I>;

declare function toArray<I>(): Pipe<I, I[]>;

declare function toSet<I>(): Pipe<I, Set<I>>;

declare function union<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any>;

declare function values<I>(): Pipe<I, I extends [any, infer V] ? V : I>;

export { at, average, bufferCount, concat, count, defaultIfEmpty, difference, distinct, distinctUntilChanged, distinctUntilKeyChanged, drop, elementAt, endWith, entries, every, fill, filter, find, findIndex, findLast, findLastIndex, first, flat, ignoreElements, includes, indexOf, intersection, isDisjointFrom, isEmpty, isSubsetOf, isSupersetOf, keys, last, lastIndexOf, map, mapTo, max, min, pipeAsync, pipeSync, pop, reduce, reverse, scan, size, skip, skipLast, slice, some, splice, startWith, sum, symmetricDifference, take, takeLast, takeWhile, toArray, toSet, union, values };
