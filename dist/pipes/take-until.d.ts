import { Operator } from "../pipe.js";
export declare function takeUntil<I>(notifier: () => Promise<any>): Operator<I, I>;
