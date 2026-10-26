import { Operator } from "../pipe.js";
export declare function startWith<I, T>(...elements: Array<T>): Operator<I, I | T>;
