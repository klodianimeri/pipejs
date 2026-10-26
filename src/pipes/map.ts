import {
    Pipe,
    Operator,
    PipeResult,
    CONTINUE,
    DONE,
    PipeArgument,
} from "../pipe.js";

export function map<I, T>(callbackFn: (element: I, index: number) => T): Operator<I, T> {
    const fn = typeof callbackFn === "function" ? callbackFn : ((e: I) => e as unknown as T);

    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<I, NextOut> => {

        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            return next(fn(element as I, i));
        };
    };
}