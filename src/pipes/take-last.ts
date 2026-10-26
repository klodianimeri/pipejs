import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, forwardAnd } from "../pipe.js";

export function takeLast<I>(count: number): Operator<I, I> {
    const targetCount = (typeof count === "number" && count > 0) ? count : 0;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {

        if (targetCount === 0) {
            return (element: PipeArgument<I>): PipeResult<NextOut> => {
                if (element === DONE) return next(DONE);
                return BREAK;
            };
        }

        const buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return forwardAnd(next, buffer, DONE);

            }

            if (buffer.length === targetCount) {
                buffer.shift();
            }

            buffer.push(element as I);

            return BREAK;
        };
    };
}
