import { Operator } from "../pipe.js";
export declare function every<I>(predicate: (element: I, index: number) => boolean): Operator<I, boolean>;
