import { Operator } from "../pipe.js";
export declare function sequenceEqual<T, R>(other: Iterable<R>, comparer?: (first: T, second: R) => boolean): Operator<T, T>;
export declare function sequenceEqualAsync<T, R>(other: AsyncIterable<R>, comparer?: (first: T, second: R) => boolean): Operator<T, T>;
