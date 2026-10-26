import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    ErrorControl,
} from "../pipe.js";

/**
 * Swallows up to `count` ErrorControl tokens and continues the source.
 * After the limit, the error is forwarded (engine will throw).
 * `count` = number of retries allowed (default: Infinity).
 */
export function retry<T>(count: number = Infinity): Operator<T, T> {
    const max =
        typeof count === "number" && count >= 0 ? count : 0;

    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let attempts = 0;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    if (attempts < max) {
                        attempts++;
                        return BREAK;
                    }
                    return next(element);
                }
                return next(element);
            }

            return next(element);
        };
    };
}