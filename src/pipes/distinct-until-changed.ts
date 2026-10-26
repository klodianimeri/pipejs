import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function distinctUntilChanged<I>(comparator?: (previous: I, current: I) => boolean): Operator<I, I> {
    const comp = typeof comparator === 'function' ? comparator : (a: I, b: I) => a === b;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let lastValue!: I;
        let hasValue = false;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const current = element as I;

            if (!hasValue || !comp(lastValue, current)) {
                hasValue = true;
                lastValue = current;
                return next(element);
            }

            return BREAK;
        };
    };
}
