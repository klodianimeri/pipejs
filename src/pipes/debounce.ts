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

export function debounce<I>(durationSelector: (value: I) => number): Operator<I, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let pending: I | undefined;
        let hasPending = false;
        let lastTime = 0;
        let currentMs = 0;

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
            const ms = durationSelector(value);
            const wait = typeof ms === "number" && ms > 0 ? ms : 0;

            if (wait === 0 && !hasPending) {
                return next(value);
            }

            if (hasPending && now - lastTime >= currentMs) {
                const toEmit = pending as I;
                pending = value;
                lastTime = now;
                currentMs = wait;
                return next(toEmit);
            }

            pending = value;
            lastTime = now;
            currentMs = wait;
            hasPending = true;
            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}