import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function findLast<I>(predicate: (element: I, index: number) => boolean): Operator<I, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let i = -1;
        let last: I | undefined;
        let hasMatch = false;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (hasMatch) {
                    return done(next, last as I)
                }

                return next(element);
            }

            ++i;

            if (predicate(element as I, i)) {
                last = element as I;
                hasMatch = true;
            }

            return BREAK;
        };
    };
}
