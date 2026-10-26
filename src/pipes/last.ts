import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function last<I>(): Operator<I, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let i = 0;
        let lastValue: I;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (i > 0) {
                    return done(next, lastValue);
                }

                return next(element);
            }

            i++;

            lastValue = element as I;

            return BREAK;
        };
    };
}
