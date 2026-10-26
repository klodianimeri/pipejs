import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE } from "../pipe.js";

export function slice<I>(start: number, end?: number): Operator<I, I> {
    const s = (typeof start === 'number' && start >= 0) ? start : 0;
    const e = (typeof end === 'number' && end > s) ? end : Infinity;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            if (i === e) {
                return next(DONE);
            }

            if (i >= s && i < e) {
                return next(element as I);
            }

            return BREAK;
        };
    };
}
