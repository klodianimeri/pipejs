import { Operator } from "../pipe.js";
export declare function findLast<I>(predicate: (element: I, index: number) => boolean): Operator<I, I>;
