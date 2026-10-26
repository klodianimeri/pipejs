import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    BREAK,
    CONTINUE,
    DONE,
    done,
} from "../pipe.js";

export function count<I = unknown>(): Operator<I, number> {
    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<I, NextOut> => {
        let counter = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) {
                return next(CONTINUE);
            }

            if (element === DONE) {
                return done(next, counter);
            }

            counter++;
            return BREAK;
        };
    };
}