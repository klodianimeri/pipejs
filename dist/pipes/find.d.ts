import { Operator } from "../pipe.js";
export declare function find<I>(predicate: (element: I, index: number) => boolean): Operator<I, I>;
