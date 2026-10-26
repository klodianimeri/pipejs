import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function findIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Operator<I, number> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;

    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<I, NextOut> => {

        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return done(next, -1);

            ++i;

            if (i >= start && predicate(element as I, i)) {
                return done(next, i);
            }

            return BREAK;
        };
    };
}
