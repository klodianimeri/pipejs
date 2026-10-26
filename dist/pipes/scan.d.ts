import { Operator } from "../pipe.js";
export declare function scan<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Operator<I, T>;
