import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function min(): Operator<number, number> {
    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<number, NextOut> => {
        let minVal = Infinity;

        return (element: PipeArgument<number>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (minVal !== Infinity) {
                    return done(next, minVal);
                }
                return next(element);
            }

            const num = element as number;

            if (typeof num === "number" && !isNaN(num) && num < minVal) {
                minVal = num;
            }

            return BREAK;
        };
    };
}
