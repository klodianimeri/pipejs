import { Operator } from "../pipe.js";
export declare function toMap<TSource, TKey, TValue = TSource>(keySelector: (item: TSource) => TKey, valueSelector?: (item: TSource) => TValue): Operator<TSource, Map<TKey, TValue>>;
