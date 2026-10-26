import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    ErrorControl,
    BREAK,
} from "../pipe.js";

export function ignoreErrors<T = unknown>(): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    return BREAK;
                }

                return next(element);
            }

            return next(element as any);
        };
    };
}