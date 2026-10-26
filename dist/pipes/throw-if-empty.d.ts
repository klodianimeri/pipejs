import { Operator } from "../pipe.js";
export declare function throwIfEmpty<T>(factory?: () => unknown): Operator<T, T>;
