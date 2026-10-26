import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function toSet<I>(): Operator<I, Set<I>> {
    return <NextOut = unknown>(next: Pipe<Set<I>, NextOut>): Pipe<I, NextOut> => {

        const buffer = new Set<I>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, buffer);
            }

            buffer.add(element as I);

            return BREAK;
        };
    };
}
