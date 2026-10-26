import { Operator } from "../pipe.js";
export interface Timestamped<T> {
    value: T;
    time: number;
}
export declare function timeStamp<I>(): Operator<I, Timestamped<I>>;
