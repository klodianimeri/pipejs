import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    forwardAnd,
} from "../pipe.js";

export function memoize<T>(): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        const cache: T[] = [];
        let memoized = false;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (memoized) {
                return forwardAnd(next, cache.slice(0, cache.length), DONE);
            }

            if (element === DONE) {
                memoized = true;
                return next(DONE);
            }

            cache.push(element as T);

            return next(element);
        };
    };
}
