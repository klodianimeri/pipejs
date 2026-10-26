import { Operator } from "../pipe.js";
export declare function catchError<T, R = T>(handler: (error: unknown) => R): Operator<T, T | R>;
