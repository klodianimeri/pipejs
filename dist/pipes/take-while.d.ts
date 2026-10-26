import { Operator } from "../pipe.js";
export declare function takeWhile<I>(predicate: (element: I, index: number) => boolean): Operator<I, I>;
