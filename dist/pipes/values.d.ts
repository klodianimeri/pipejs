import { Operator } from "../pipe.js";
export declare function values<I>(): Operator<I, I extends [any, infer V] ? V : I>;
