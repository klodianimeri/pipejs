import { Operator } from "../pipe.js";
export declare function switchMap<T, R>(project: (value: T, index: number) => AsyncIterable<R>): Operator<T, R>;
