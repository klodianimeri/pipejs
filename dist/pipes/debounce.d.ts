import { Operator } from "../pipe.js";
export declare function debounce<I>(durationSelector: (value: I) => number): Operator<I, I>;
