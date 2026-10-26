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

export function average<I>(): Operator<I, number> {
    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<I, NextOut> => {
        let count = 0;
        let sum = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (count > 0) {
                    return done(next, sum / count);
                }

                return next(DONE);
            }

            if (typeof element === "number") {
                count++;
                sum += element;
            }

            return BREAK;
        };
    };
}
