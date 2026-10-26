import { Operator } from "../pipe.js";
export declare function distinctUntilKeyChanged<I extends object, K extends keyof I>(key: K, comparator?: (previous: I[K], current: I[K]) => boolean): Operator<I, I>;
