import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    IS_ASYNC_OPERATOR
} from "../pipe.js";

class TimeoutError extends Error {
    constructor() {
        super("TimeoutError")
    }
}

export function timeout<T = unknown>(interval: number): Operator<T, T> {
    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let previousTime: number = Date.now();

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) return next(DONE);

            const now = Date.now();

            if ((now - previousTime) > interval) {
                throw new TimeoutError();
            }

            previousTime = now;

            return next(element);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}