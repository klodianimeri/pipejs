import { Operator } from "../pipe.js";
export declare function single<T>(predicate?: (value: T, index: number) => boolean): Operator<T, T>;
