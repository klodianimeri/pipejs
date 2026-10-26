import { Operator } from "../pipe.js";
export type TapObserver<T> = {
    next?: (value: T) => void;
    error?: (err: unknown) => void;
    complete?: () => void;
};
export declare function tap<T>(observer: TapObserver<T> | ((value: T) => void)): Operator<T, T>;
