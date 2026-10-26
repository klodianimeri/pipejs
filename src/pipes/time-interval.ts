import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

export interface TimeInterval<T> {
    value: T;
    elapsed: number;
}

export function timeInterval<I>(): Operator<I, TimeInterval<I>> {
    const op = <NextOut = unknown>(next: Pipe<TimeInterval<I>, NextOut>): Pipe<I, NextOut> => {
        let last = Date.now();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const now = Date.now();
            const span = now - last;
            last = now;

            return next({ value: element as I, elapsed: span });
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}