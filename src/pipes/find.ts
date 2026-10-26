import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function find<I>(predicate: (element: I, index: number) => boolean): Operator<I, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(element);

            ++i;

            if (predicate(element as I, i)) {
                return done(next, element as I)
            }

            return BREAK;
        };
    };
}
