import { Operator } from "../pipe.js";
export declare function endWith<I, T>(...elements: Array<T>): Operator<I, I | T>;
