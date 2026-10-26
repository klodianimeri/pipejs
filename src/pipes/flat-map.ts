import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    DONE,
    ErrorControl,
    forward,
    IS_ASYNC_OPERATOR,
    forwardAnd,
} from "../pipe.js";
import { allSettled, isAsyncIterable, isIterable } from "../util/index.js";

/** Sync: sequential flatten (only option for Iterable). */
export function flatMap<I, O>(selector: (value: I, index: number) => Iterable<O>): Operator<I, O> {
    return <NextOut = unknown>(next: Pipe<O, NextOut>): Pipe<I, NextOut> => {
        let index = 0;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const projected = selector(element as I, index++);

            if (!projected || !isIterable(projected)) {
                return BREAK;
            }

            return forward(next, projected);
        };
    };
}

/**
 * Async: concurrent flatten (mergeMap).
 * Inners run in parallel; values buffered and flushed on each pull / DONE.
 */
export function flatMapAsync<I, O>(
    selector: (value: I, index: number) => AsyncIterable<O>
): Operator<I, O> {
    const op = <NextOut = unknown>(
        next: Pipe<O, NextOut>
    ): Pipe<I, NextOut> => {
        const buffer: O[] = [];
        const tasks: Promise<void>[] = [];
        let closed = false;
        let error: any;
        let index = 0;

        return async (
            element: PipeArgument<I>
        ): Promise<PipeResult<NextOut>> => {
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

            let projected: AsyncIterable<O>;
            try {
                projected = selector(element as I, index++);
            } catch (err) {
                error = err;
                throw err;
            }

            if (!projected || !isAsyncIterable(projected)) {
                return BREAK;
            }

            // start inner without awaiting full drain
            tasks.push(
                (async () => {
                    try {
                        for await (const v of projected) {
                            if (closed) break;
                            buffer.push(v);
                        }
                    } catch (err) {
                        error = err;
                    }
                })()
            );

            // let microtasks push into buffer
            await Promise.resolve();

            if (buffer.length) {
                return forward(next, buffer.splice(0, buffer.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;
    return op;
}