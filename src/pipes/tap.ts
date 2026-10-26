import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    ErrorControl,
} from "../pipe.js";

export type TapObserver<T> = {
    next?: (value: T) => void;
    error?: (err: unknown) => void;
    complete?: () => void;
};

/**
 * Side-effects for each value / error / completion without changing the stream.
 */
export function tap<T>(observer: TapObserver<T> | ((value: T) => void)): Operator<T, T> {
    const obs: TapObserver<T> = typeof observer === "function" ? { next: observer } : observer;

    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) obs.error?.(element as T);
                return next(element);
            }

            if (element === DONE) {
                obs.complete?.();
                return next(DONE);
            }

            obs.next?.(element as T);

            return next(element as T);
        };
    };
}