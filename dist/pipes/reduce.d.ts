import { Operator } from "../pipe.js";
export declare function reduce<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Operator<I, T>;
