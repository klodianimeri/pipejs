import { Operator } from "../pipe.js";
export declare function skipUntil<I>(notifier: () => Promise<any>): Operator<I, I>;
