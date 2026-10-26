import { Operator } from "../pipe.js";
export declare function filter<I>(predicate: (element: I, index: number) => boolean): Operator<I, I>;
