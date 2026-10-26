import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function scan<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Operator<I, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<I, NextOut> => {
        let i = -1;
        let value: T;
        let hasValue = typeof initialValue !== "undefined";

        if (hasValue) {
            value = initialValue!;
        }

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            if (!hasValue && i === 0) {
                value = element as unknown as T;
                hasValue = true;
                return next(value);
            }

            value = accumulator(value, element as I, i);

            return next(value);
        };
    };
}
