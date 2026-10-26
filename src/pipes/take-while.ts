import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function takeWhile<I>(predicate: (element: I, index: number) => boolean): Operator<I, I> {

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {

        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            if (predicate(element as I, i)) {
                return next(element as I);
            }

            return next(DONE);
        };
    };
}
