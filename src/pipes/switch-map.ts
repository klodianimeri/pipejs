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
    PipeResults,
    forwardAnd,
} from "../pipe.js";

import { allSettled, isAsyncIterable, isIterable } from "../util/index.js";

export function switchMap<T, R>(project: (value: T, index: number) => AsyncIterable<R>): Operator<T, R> {
    const op = <NextOut = unknown>(next: Pipe<R, NextOut>): Pipe<T, NextOut> => {
        const buffer: R[] = [];
        const tasks: Promise<void>[] = [];
        let closed = false;
        let error: any;
        let i = -1;

        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (error) {
                closed = true;
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) closed = true;
                return next(element as any);
            }

            if (element === DONE) {
                await allSettled(tasks);

                closed = true;
                if (error) throw error;

                if (buffer.length) {
                    return forwardAnd(next, buffer.splice(0, buffer.length), DONE);
                }

                return next(DONE)
            }

            // Project the current value to an inner async iterable
            i++;
            const index = i;
            let inner: AsyncIterable<R>;

            try {
                inner = project(element as T, index);
            } catch (err) {
                error = err;
                throw err;
            }

            if (!inner || (!isIterable(inner) && !isAsyncIterable(inner))) {
                return BREAK;
            }

            // Launch the new inner, cancelling any previous one via the index check
            tasks.push((async () => {
                try {
                    for await (const v of inner) {
                        if (index !== i) break;   // a newer projection has started
                        if (closed) break;
                        buffer.push(v);
                    }
                } catch (err) {
                    error = err;
                }
            })());

            if (buffer.length) {
                let results = new PipeResults<NextOut>();

                for (const item of buffer) {
                    results.push(next(item));
                }

                buffer.length = 0;

                return results.singleOrDefault();
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;
    return op;
}