import { Operator } from "../pipe.js";
export declare function groupBy<I, K, V = I>(keySelector: (value: I) => K, elementSelector?: (value: I) => V): Operator<I, Map<K, V[]>>;
