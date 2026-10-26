import { Operator } from "../pipe.js";
export declare function some<I>(predicate: (element: I, index: number) => boolean): Operator<I, boolean>;
