import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    DONE,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

/**
 * Leading throttle by wall-clock ms.
 * Emits a value, then drops source values until `dueTime` has elapsed.
 */
export function throttleTime<I>(dueTime: number): Operator<I, I> {
    const ms = typeof dueTime === "number" && dueTime > 0 ? dueTime : 0;

    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let lastEmit = -Infinity;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const value = element as I;

            if (ms === 0) {
                return next(value);
            }

            const now = Date.now();
            if (now - lastEmit >= ms) {
                lastEmit = now;
                return next(value);
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}