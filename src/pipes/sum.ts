import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function sum<I>(): Operator<I, number> {
    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<I, NextOut> => {

        let totalSum = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, totalSum);
            }

            const val = element as any;

            if (typeof val === 'number' && !isNaN(val)) {
                totalSum += val;
            }

            return BREAK;
        };
    };
}
