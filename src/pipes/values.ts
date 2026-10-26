import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function values<I>(): Operator<I, I extends [any, infer V] ? V : I> {
    return <NextOut = unknown>(next: Pipe<I extends [any, infer V] ? V : I, NextOut>): Pipe<I, NextOut> => {

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const val = element as any;

            if (Array.isArray(val) && val.length === 2) {
                return next(val[1]);
            }

            return next(element as any);
        };
    };
}
