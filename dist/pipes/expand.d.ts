import { Operator } from "../pipe.js";
export declare function expand<T>(project: (value: T, index: number) => Iterable<T> | null | undefined): Operator<T, T>;
export declare function expandAsync<T>(project: (value: T, index: number) => AsyncIterable<T> | Promise<AsyncIterable<T>> | null | undefined): Operator<T, T>;
