import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function skipLast<I>(count: number): Operator<I, I> {
    const skipCount = (typeof count === "number" && count > 0) ? count : 0;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        if (skipCount === 0) {
            return (element: PipeArgument<I>): PipeResult<NextOut> => next(element);
        }

        const items: I[] = [];

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            items.push(element as I);

            if (items.length > skipCount) {
                return next(items.shift()!);
            }

            return BREAK;
        };
    };
}
