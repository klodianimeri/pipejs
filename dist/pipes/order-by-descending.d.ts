import { Operator } from "../pipe.js";
export declare function orderByDescending<I, K>(keySelector: (item: I) => K, comparer?: (a: K, b: K) => number): Operator<I, I>;
