import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function distinctUntilKeyChanged<I extends object, K extends keyof I>(key: K, comparator?: (previous: I[K], current: I[K]) => boolean): Operator<I, I> {
    const comp = comparator ?? ((a: I[K], b: I[K]) => a === b);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let lastValue!: I;
        let hasValue = false;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const currentValue = element as I;

            if (hasValue && comp(lastValue[key], currentValue[key])) {
                return BREAK;
            }

            hasValue = true;
            lastValue = currentValue;
            return next(element);
        };
    };
}
