import { Operator } from "../pipe.js";
export declare function withLatestFrom<T, R extends any[]>(...others: {
    [K in keyof R]: AsyncIterable<R[K]>;
}): Operator<T, [T, ...R]>;
