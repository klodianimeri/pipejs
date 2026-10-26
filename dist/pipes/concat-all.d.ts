import { Operator } from "../pipe.js";
export declare function concatAll<I>(): Operator<Iterable<I>, I>;
export declare function concatAllAsync<I>(): Operator<AsyncIterable<I>, I>;
