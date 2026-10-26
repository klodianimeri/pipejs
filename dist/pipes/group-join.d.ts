import { Operator } from "../pipe.js";
export declare function groupJoin<I, TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: (value: I) => TKey, innerKeySelector: (value: TInner) => TKey, resultSelector: (outer: I, innerArgs: Iterable<TInner>) => TResult): Operator<I, TResult>;
