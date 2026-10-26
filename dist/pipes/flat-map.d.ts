import { Operator } from "../pipe.js";
export declare function flatMap<I, O>(selector: (value: I, index: number) => Iterable<O>): Operator<I, O>;
export declare function flatMapAsync<I, O>(selector: (value: I, index: number) => AsyncIterable<O>): Operator<I, O>;
