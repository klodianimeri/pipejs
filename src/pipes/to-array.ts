import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function toArray<I>(): Operator<I, I[]> {
    return <NextOut = unknown>(next: Pipe<I[], NextOut>): Pipe<I, NextOut> => {

        const buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, buffer);
            }

            buffer.push(element as I);

            return BREAK;
        };
    };
}
