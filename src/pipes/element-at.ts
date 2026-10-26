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

/**
 * Emits the element at `index`, or `undefined` if out of range / negative
 * (IxJS elementAt semantics, as a pipe operator).
 */
export function elementAt<I = unknown>(index: number): Operator<I, I | undefined> {
    return <NextOut = unknown>(next: Pipe<I | undefined, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (index < 0) {
                return next(DONE);
            }

            if (element === DONE) {
                return next(DONE);
            }

            ++i;

            if (i === index) {
                return done(next, element as I);
            }

            return BREAK;
        };
    };
}