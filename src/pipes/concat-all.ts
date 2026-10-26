import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    IS_ASYNC_OPERATOR,
    forward,
    forwardAsync,
} from "../pipe.js";

import { isIterable, isAsyncIterable } from "../util/index.js";

export function concatAll<I>(): Operator<Iterable<I>, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<Iterable<I>, NextOut> => {
        return (element: PipeArgument<Iterable<I>>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!element || !isIterable(element)) {
                return BREAK;
            }

            return forward(next, element as Iterable<I>);
        };
    };
}

export function concatAllAsync<I>(): Operator<AsyncIterable<I>, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<AsyncIterable<I>, NextOut> => {
        return async (element: PipeArgument<AsyncIterable<I>>): Promise<PipeResult<NextOut>> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!element || !isAsyncIterable(element)) {
                return BREAK;
            }

            return await forwardAsync(next, element as AsyncIterable<I>);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}