import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, done } from "../pipe.js";

export function take<I>(count: number): Operator<I, I> {
    const limit = (typeof count === "number" && count > 0) ? count : 0;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {

        if (limit === 0) {
            return (element: PipeArgument<I>): PipeResult<NextOut> => next(DONE);
        }

        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            if (i < limit) {
                return next(element);
            }

            return next(DONE)
        };
    };
}