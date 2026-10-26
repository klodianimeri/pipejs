import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function skip<I>(count: number): Operator<I, I> {
    const skipCount = (typeof count === 'number' && count > 0) ? count : 0;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let i = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (i >= skipCount) {
                return next(element);
            }

            i++;

            return BREAK;
        };
    };
}
