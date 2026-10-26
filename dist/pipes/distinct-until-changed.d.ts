import { Operator } from "../pipe.js";
export declare function distinctUntilChanged<I>(comparator?: (previous: I, current: I) => boolean): Operator<I, I>;
