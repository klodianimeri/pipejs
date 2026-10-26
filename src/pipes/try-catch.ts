import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    ErrorControl,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

/**
 * Catches errors from downstream `next(...)` (sync throw or Promise reject)
 * and forwards them as ErrorControl — pair with `catchError` / `retry` / `ignoreErrors`.
 */
export function tryCatch<T>(): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        return (element: PipeArgument<T>): PipeResult<NextOut> | Promise<PipeResult<NextOut>> => {
            try {
                const result = next(element as any);

                if (result != null && typeof (result as any).then === "function") {
                    return Promise.resolve(result).catch((error) =>
                        next(new ErrorControl(error) as any)
                    );
                }

                return result;
            } catch (error) {
                return next(new ErrorControl(error) as any);
            }
        };
    };
}