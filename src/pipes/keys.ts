import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";

export function keys<I, TResult = I extends [infer K, any] ? K : number>(): Operator<I, TResult> {

    return <NextOut = unknown>(next: Pipe<TResult, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            const val = element as any;

            if (Array.isArray(val) && val.length === 2) {
                return next(val[0]);
            }

            return next(i as TResult);
        };
    };
}
