import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function includes<I>(value: I, fromIndex?: number): Operator<I, boolean> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;

    return <NextOut = unknown>(next: Pipe<boolean, NextOut>): Pipe<I, NextOut> => {

        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, false);
            }

            ++i;

            if (i >= start && (element as I) === value) {
                return done(next, true);
            }

            return BREAK;
        };
    };
}
