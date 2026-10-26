import { Operator } from "../pipe.js";
export declare function findLastIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Operator<I, number>;
