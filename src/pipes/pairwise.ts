import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function pairwise<I>(): Operator<I, [I, I]> {
    return <NextOut = unknown>(next: Pipe<[I, I], NextOut>): Pipe<I, NextOut> => {
        let hasPrevious = false;
        let previousValue: I;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!hasPrevious) {
                previousValue = element as I;
                hasPrevious = true;
                return BREAK;
            }

            const current = element as I;

            const pair: [I, I] = [previousValue, current];
            previousValue = current;

            return next(pair);
        };
    };
}
