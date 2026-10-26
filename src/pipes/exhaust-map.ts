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

/** Sync: project + exhaustAll (≡ concatMap for Iterable). */
export function exhaustMap<T, R>(
    project: (value: T, index: number) => Iterable<R>
): Operator<T, R> {
    return <NextOut = unknown>(next: Pipe<R, NextOut>): Pipe<T, NextOut> => {
        let i = -1;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element as any);
            if (element === DONE) return next(DONE);

            ++i;
            const inner = project(element as T, i);

            if (!inner || !isIterable(inner)) {
                return BREAK;
            }

            return forward(next, inner);
        };
    };
}

/** Async: project + exhaustAllAsync. */
export function exhaustMapAsync<T, R>(
    project: (value: T, index: number) => AsyncIterable<R>
): Operator<T, R> {
    const op = <NextOut = unknown>(
        next: Pipe<R, NextOut>
    ): Pipe<T, NextOut> => {
        const buffer: R[] = [];
        let busy = false;
        let pending: Promise<void> | null = null;
        let closed = false;
        let error: any;
        let i = -1;

        const consume = async (inner: AsyncIterable<R>) => {
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

        return async (
            element: PipeArgument<T>
        ): Promise<PipeResult<NextOut>> => {
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

            ++i;
            let inner: AsyncIterable<R>;

            try {
                inner = project(element as T, i);
            } catch (err) {
                error = err;
                throw err;
            }

            if (!inner || !isAsyncIterable(inner)) {
                return BREAK;
            }

            busy = true;
            pending = consume(inner);

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