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
 * Leading throttle driven by a per-value notifier (AsyncIterable).
 * Emits a value, then ignores source until that notifier emits/completes.
 */
export function throttle<I>(durationSelector: (value: I) => AsyncIterable<any>): Operator<I, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let open = true;
        let generation = 0;

        const arm = (value: I) => {
            const gen = ++generation;
            const iter = durationSelector(value)[Symbol.asyncIterator]();

            Promise.resolve(iter.next()).then(
                () => {
                    if (gen === generation) open = true;
                },
                () => {
                    if (gen === generation) open = true;
                }
            );
        };

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                generation++;
                open = true;
                return next(DONE);
            }

            if (!open) {
                return BREAK;
            }

            const value = element as I;
            open = false;
            arm(value);
            return next(value);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}