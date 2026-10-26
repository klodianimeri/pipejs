import { Operator } from "../pipe.js";
export declare function findIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Operator<I, number>;
