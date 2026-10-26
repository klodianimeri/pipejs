import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

export interface Timestamped<T> {
    value: T;
    time: number;
}

export function timeStamp<I>(): Operator<I, Timestamped<I>> {
    const op = <NextOut = unknown>(
        next: Pipe<Timestamped<I>, NextOut>
    ): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            return next({ value: element as I, time: Date.now() });
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}