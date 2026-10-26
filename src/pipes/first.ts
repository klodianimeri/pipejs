import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, done } from "../pipe.js";

export function first<I>(): Operator<I, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(element);

            return done(next, element);
        };
    };
}
