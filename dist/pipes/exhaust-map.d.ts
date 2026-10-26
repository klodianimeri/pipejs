import { Operator } from "../pipe.js";
export declare function exhaustMap<T, R>(project: (value: T, index: number) => Iterable<R>): Operator<T, R>;
export declare function exhaustMapAsync<T, R>(project: (value: T, index: number) => AsyncIterable<R>): Operator<T, R>;
