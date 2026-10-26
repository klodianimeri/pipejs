import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    done,
} from "../pipe.js";

/**
 * If the source completes empty, throws (or the error from `factory`).
 * Otherwise passes values through unchanged.
 */
export function throwIfEmpty<T>(factory?: () => unknown): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let hasValue = false;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (!hasValue) {
                    const err = typeof factory === "function" ? factory() : new Error("throwIfEmpty: sequence is empty");
                    throw err instanceof Error ? err : new Error(String(err));
                }
                return next(DONE);
            }

            hasValue = true;
            return next(element as any);
        };
    };
}