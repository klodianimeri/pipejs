import { Operator } from "../pipe.js";
export declare function distinct<I, K = I>(keySelector?: (value: I) => K): Operator<I, I>;
