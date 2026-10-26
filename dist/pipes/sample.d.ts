import { Operator } from "../pipe.js";
export declare function sample<T = unknown>(notifier: AsyncIterable<any>): Operator<T, T>;
