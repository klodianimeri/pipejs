import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function every<I>(predicate: (element: I, index: number) => boolean): Operator<I, boolean> {

    return <NextOut = unknown>(next: Pipe<boolean, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, true);
            }

            ++i;

            if (!predicate(element as I, i)) {
                return done(next, false);
            }

            return BREAK;
        };
    };
}
