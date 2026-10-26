import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, forwardAnd } from "../pipe.js";

export function endWith<I, T>(...elements: Array<T>): Operator<I, I | T> {
    return <NextOut = unknown>(next: Pipe<I | T, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return forwardAnd(next, elements, DONE)
            }

            return next(element);
        };
    };
}
