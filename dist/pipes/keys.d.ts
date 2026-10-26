import { Operator } from "../pipe.js";
export declare function keys<I, TResult = I extends [infer K, any] ? K : number>(): Operator<I, TResult>;
