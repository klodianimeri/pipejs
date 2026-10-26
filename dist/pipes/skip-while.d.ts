import { Operator } from "../pipe.js";
export declare function skipWhile<I>(predicate: (element: I, index: number) => boolean): Operator<I, I>;
