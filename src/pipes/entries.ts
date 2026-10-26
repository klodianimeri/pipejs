import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function entries<I>(): Operator<I, [number, I]> {
    return <NextOut = unknown>(next: Pipe<[number, I], NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            return next([i, element as I]);
        };
    };
}
