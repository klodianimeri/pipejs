import { Operator } from "../pipe.js";
export declare function throttle<I>(durationSelector: (value: I) => AsyncIterable<any>): Operator<I, I>;
