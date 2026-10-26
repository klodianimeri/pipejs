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
    forward,
    forwardAnd,
} from "../pipe.js";

import { isIterable, isAsyncIterable, allSettled } from "../util/index.js";


export function switchAll<I>(): Operator<AsyncIterable<I>, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<AsyncIterable<I>, NextOut> => {
        const buffer: I[] = [];
        const tasks: Promise<void>[] = [];
        let closed = false;
        let error: any;
        let i: number = -1;

        return async (element: PipeArgument<AsyncIterable<I>>): Promise<PipeResult<NextOut>> => {
            if (error) {
                closed = true;
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) closed = true;
                return next(element);
            }

            if (element === DONE) {
                await allSettled(tasks);

                closed = true;
                if (error) throw error;
                if (buffer.length) {
                    return forwardAnd(next, buffer.splice(0, buffer.length), DONE);
                }

                return next(DONE);
            }

            if (!element || (!isIterable(element) && !isAsyncIterable(element))) {
                return BREAK;
            }

            i++;

            tasks.push((async () => {
                try {
                    let index: number = i;
                    for await (const v of element as AsyncIterable<I>) {
                        if (index !== i) break;
                        if (closed) break;
                        buffer.push(v);
                    }
                } catch (err) {
                    error = err;
                }
            })());

            if (buffer.length) {
                return forward(next, buffer.splice(0, buffer.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}