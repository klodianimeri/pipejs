import { Operator } from "../pipe.js";
export declare function exhaustAll<I>(): Operator<Iterable<I>, I>;
export declare function exhaustAllAsync<I>(): Operator<AsyncIterable<I>, I>;
