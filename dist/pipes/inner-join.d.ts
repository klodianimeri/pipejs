import { Operator } from "../pipe.js";
export declare function innerJoin<I, TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: (value: I) => TKey, innerKeySelector: (value: TInner) => TKey, resultSelector: (outer: I, inner: TInner) => TResult): Operator<I, TResult>;
