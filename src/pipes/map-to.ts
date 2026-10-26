import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function mapTo<I, T>(value: T): Operator<I, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            return next(value);
        };
    };
}
