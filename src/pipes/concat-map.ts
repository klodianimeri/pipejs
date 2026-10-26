import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    forward,
    IS_ASYNC_OPERATOR,
    BREAK,
} from "../pipe.js";

import { isIterable, isAsyncIterable } from "../util/index.js";


/**
 * Maps each source value to an inner Iterable / AsyncIterable and
 * concatenates results in order (waits for each inner to finish).
 */
export function concatMap<I, O>(project: (value: I, index: number) => Iterable<O>): Operator<I, O> {
    return <NextOut = unknown>(next: Pipe<O, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;
            const inner = project(element as I, i);

            if (inner != null && isIterable(inner)) {
                const items: O[] = [];
                for (const v of inner as Iterable<O>) {
                    items.push(v);
                }
                return forward(next, items);
            }

            return BREAK;
        };
    };
}

export function concatMapAsync<I, O>(project: (value: I, index: number) => AsyncIterable<O>): Operator<I, O> {
    const op = <NextOut = unknown>(next: Pipe<O, NextOut>): Pipe<I, NextOut> => {
        let i = -1;

        return async (element: PipeArgument<I>): Promise<PipeResult<NextOut>> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            ++i;

            const inner = project(element as I, i);

            if (inner != null && isAsyncIterable(inner)) {
                const items: O[] = [];

                for await (const v of inner as AsyncIterable<O>) {
                    items.push(v);
                }

                return forward(next, items);
            }

            return BREAK;
        };

    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op as any;
}