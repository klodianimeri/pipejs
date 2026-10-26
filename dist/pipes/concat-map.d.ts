import { Operator } from "../pipe.js";
export declare function concatMap<I, O>(project: (value: I, index: number) => Iterable<O>): Operator<I, O>;
export declare function concatMapAsync<I, O>(project: (value: I, index: number) => AsyncIterable<O>): Operator<I, O>;
