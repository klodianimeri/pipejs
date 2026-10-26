import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function skipWhile<I>(predicate: (element: I, index: number) => boolean): Operator<I, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let skip = true;
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            if (skip) {
                if (predicate(element as I, i)) {
                    return BREAK;
                }

                skip = false;
            }

            return next(element as I);
        };
    };
}
