import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, PipeResults, done } from "../pipe.js";

export function isEmpty<I>(): Operator<I, boolean> {
    return <NextOut = unknown>(next: Pipe<boolean, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, true);
            }

            return done(next, false);
        };
    };
}
