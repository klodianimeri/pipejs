import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, forwardAnd } from "../pipe.js";

export function startWith<I, T>(...elements: Array<T>): Operator<I, I | T> {
    return <NextOut = unknown>(next: Pipe<I | T, NextOut>): Pipe<I, NextOut> => {
        let sent = false;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (sent) {
                return next(element as unknown as I | T);
            }

            if (element instanceof CONTINUE) return next(element);

            sent = true;

            return forwardAnd(next, elements, element);
        };
    };
}
