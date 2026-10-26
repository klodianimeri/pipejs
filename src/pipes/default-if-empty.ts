import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, done } from "../pipe.js";

export function defaultIfEmpty<I, T>(value: T): Operator<I, I | T> {
    return <NextOut = unknown>(next: Pipe<I | T, NextOut>): Pipe<I, NextOut> => {
        let isEmpty = true;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (isEmpty) {
                    return done(next, value);
                }

                return next(DONE);
            }

            isEmpty = false;

            return next(element);
        };
    };
}
