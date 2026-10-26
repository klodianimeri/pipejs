import { Operator } from "../pipe.js";
export declare function except<I>(second: Iterable<I>, keySelector?: (value: I) => any): Operator<I, I>;
