import { Operator } from "../pipe.js";
export declare function union<I>(...sources: Array<Iterable<I>>): Operator<I, I>;
