import { Operator } from "../pipe.js";
export interface TimeInterval<T> {
    value: T;
    elapsed: number;
}
export declare function timeInterval<I>(): Operator<I, TimeInterval<I>>;
