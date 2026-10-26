import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    ErrorControl,
    IS_ASYNC_OPERATOR,
    done,
} from "../pipe.js";

import { assertAsync, assertSync, compare } from "../util/index.js";

export function sequenceEqual<T, R>(other: Iterable<R>, comparer?: (first: T, second: R) => boolean): Operator<T, T> {
    assertSync(other);
    comparer = typeof comparer === "function" ? comparer : compare;

    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        const iterator: Iterator<R> = other[Symbol.iterator]();
        let error: any;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (error) throw error;

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    if (iterator.return) iterator.return();
                }

                return next(element as any);
            }

            let nextResult: IteratorResult<R> = iterator.next();

            if (element === DONE) {
                if (nextResult.done) {
                    return done(next, true);
                }

                return done(next, false);
            }

            if (nextResult.done) {
                return done(next, false);
            }

            if (!comparer(element as T, nextResult.value as R)) {
                return done(next, false);
            }

            return BREAK;
        };
    };
}

export function sequenceEqualAsync<T, R>(other: AsyncIterable<R>, comparer?: (first: T, second: R) => boolean): Operator<T, T> {
    assertAsync(other);
    comparer = typeof comparer === "function" ? comparer : compare;

    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        const iterator: AsyncIterator<R> = other[Symbol.asyncIterator]();
        let error: any;

        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (error) throw error;

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    if (iterator.return) iterator.return();
                }

                return next(element as any);
            }

            let nextResult: IteratorResult<R> = await iterator.next();

            if (element === DONE) {

                if (nextResult.done) {
                    return done(next, true);
                }

                return done(next, false);
            }

            if (nextResult.done) {
                return done(next, false);
            }

            if (!comparer(element as T, nextResult.value as R)) {
                return done(next, false);
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}