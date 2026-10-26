import { Operator } from "../pipe.js";
export declare function splice<I, T>(start: number, deleteCount: number, ...elements: Array<T>): Operator<I, I | T>;
