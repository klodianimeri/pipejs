import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function ignoreElements<I>(): Operator<I, never> {
    return <NextOut = unknown>(next: Pipe<never, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            return BREAK;
        };
    };
}
