import { Operator } from "../pipe.js";
export declare function buffer<T = unknown>(notifier: AsyncIterable<any>): Operator<T, T[]>;
