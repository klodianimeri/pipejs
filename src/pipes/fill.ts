import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function fill<I, T>(value: T, start?: number, end?: number): Operator<I, I | T> {
    const s = typeof start === 'number' ? start : 0;
    const e = typeof end === 'number' ? end : Infinity;

    return <NextOut = unknown>(next: Pipe<I | T, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(element);

            ++i;

            if (i >= s && i < e) {
                return next(value);
            }

            return next(element);
        };
    };
}
