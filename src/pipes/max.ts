import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function max(): Operator<number, number> {
    return <NextOut = unknown>(next: Pipe<number, NextOut>): Pipe<number, NextOut> => {
        let maxVal = -Infinity;

        return (element: PipeArgument<number>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (maxVal !== -Infinity) {
                    return done(next, maxVal);
                }

                return next(element);
            }

            const num = element as number;

            if (typeof num === "number" && !isNaN(num) && num > maxVal) {
                maxVal = num;
            }

            return BREAK;
        };
    };
}
