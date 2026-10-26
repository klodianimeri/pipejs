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
 * Emits the latest source value when at least `period` ms have passed
 * since the sampling window started / last emission (checked on each pull).
 * First value opens the window but is not emitted immediately.
 */
export function sampleTime<I>(period: number): Operator<I, I> {
    const ms = typeof period === "number" && period > 0 ? period : 0;

    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let latest: I | undefined;
        let lastEmit: number | null = null;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            latest = element as I;

            if (ms === 0) {
                return next(latest);
            }

            const now = Date.now();

            // First value starts the window only
            if (lastEmit === null) {
                lastEmit = now;
                return BREAK;
            }

            if (now - lastEmit >= ms) {
                lastEmit = now;
                return next(latest);
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}