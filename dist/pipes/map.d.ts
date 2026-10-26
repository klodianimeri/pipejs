import { Operator } from "../pipe.js";
export declare function map<I, T>(callbackFn: (element: I, index: number) => T): Operator<I, T>;
