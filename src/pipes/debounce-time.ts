import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    DONE,
    done,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

/**
 * Trailing debounce (pull-safe).
 * - Stores latest value
 * - When a new value arrives after ≥ dueTime ms since the previous arrival, emits the previous one
 * - Always flushes the last pending value on DONE
 */
export function debounceTime<I>(dueTime: number): Operator<I, I> {
    const ms = typeof dueTime === "number" && dueTime > 0 ? dueTime : 0;

    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let pending: I | undefined;
        let hasPending = false;
        let lastTime = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (hasPending) {
                    hasPending = false;
                    return done(next, pending as I);
                }
                return next(DONE);
            }

            const value = element as I;
            const now = Date.now();

            if (ms === 0) {
                return next(value);
            }

            if (hasPending && now - lastTime >= ms) {
                const toEmit = pending as I;
                pending = value;
                lastTime = now;
                return next(toEmit);
            }

            pending = value;
            lastTime = now;
            hasPending = true;
            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}