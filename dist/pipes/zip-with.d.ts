import { Operator } from "../pipe.js";
export declare function zipWith<I, TZip, TResult = [I, TZip]>(other: Iterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult): Operator<I, TResult>;
export declare function zipWithAsync<I, TZip, TResult = [I, TZip]>(other: AsyncIterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult): Operator<I, TResult>;
