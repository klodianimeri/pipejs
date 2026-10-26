import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    ErrorControl,
} from "../pipe.js";

export function catchError<T, R = T>(handler: (error: unknown) => R): Operator<T, T | R> {
    return <NextOut = unknown>(next: Pipe<T | R, NextOut>): Pipe<T, NextOut> => {
        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    return next(handler(element.error) as any);
                }

                return next(element);
            }

            return next(element as any);
        };
    };
}