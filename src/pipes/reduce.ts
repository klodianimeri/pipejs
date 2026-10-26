import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function reduce<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Operator<I, T> {

    return <Next = unknown>(next: Pipe<T, Next>): Pipe<I, Next> => {

        let i = -1;
        let value: T;
        let hasValue = typeof initialValue !== "undefined";

        if (hasValue) {
            value = initialValue!;
        }

        return (element: PipeArgument<I>): PipeResult<Next> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (hasValue || i >= 0) {
                    return done(next, value);
                }

                return next(DONE);
            }

            ++i;

            if (!hasValue && i === 0) {
                value = element as unknown as T;
                hasValue = true;
                return BREAK;
            }

            value = accumulator(value, element as I, i);

            return BREAK;
        };
    };
}
