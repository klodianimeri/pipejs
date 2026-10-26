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
import { isIterable, isAsyncIterable } from "../util/index.js";

/**
 * Sync: one inner at a time; each Iterable is fully drained before the next
 * source item (same as concatAll for sync).
 */
export function exhaustAll<I>(): Operator<Iterable<I>, I> {
    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<Iterable<I>, NextOut> => {
        return (element: PipeArgument<Iterable<I>>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element as any);
            if (element === DONE) return next(DONE);

            if (!element || !isIterable(element)) {
                return BREAK;
            }

            return forward(next, element);
        };
    };
}


export function exhaustAllAsync<I>(): Operator<AsyncIterable<I>, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<AsyncIterable<I>, NextOut> => {
        const buffer: I[] = [];
        let busy = false;
        let pending: Promise<void> | null = null;
        let closed = false;
        let error: any;

        const consume = async (inner: AsyncIterable<I>) => {
            try {
                for await (const v of inner) {
                    if (closed) break;
                    buffer.push(v);
                }
            } catch (err) {
                error = err;
            } finally {
                busy = false;
            }
        };

        return async (element: PipeArgument<AsyncIterable<I>>): Promise<PipeResult<NextOut>> => {
            if (error) {
                closed = true;
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) closed = true;
                return next(element as any);
            }

            if (element === DONE) {
                if (pending) await pending;
                closed = true;
                if (error) throw error;
                if (buffer.length) {
                    return forwardAnd(next, buffer.splice(0, buffer.length), DONE);
                }
                return next(DONE);
            }

            if (busy) {
                if (buffer.length) {
                    return forward(next, buffer.splice(0, buffer.length));
                }
                return BREAK;
            }

            if (!element || !isAsyncIterable(element)) {
                return BREAK;
            }

            busy = true;
            pending = consume(element as AsyncIterable<I>);

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