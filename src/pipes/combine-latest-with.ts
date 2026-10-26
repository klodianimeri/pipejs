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

import { ARRAY_EMPTY_SLOT, assertAsyncs } from "../util/index.js";

export function combineLatestWith<T, R extends any[]>(...others: { [K in keyof R]: AsyncIterable<R[K]> }): Operator<T, [T, ...R]> {
    assertAsyncs(others);

    const op = <NextOut = unknown>(next: Pipe<[T, ...R], NextOut>): Pipe<T, NextOut> => {
        const buffer: [T, ...R][] = [];
        const latest: any[] = new Array(others.length + 1).fill(ARRAY_EMPTY_SLOT);
        const iteratorsDone: boolean[] = new Array(others.length).fill(false);
        const iterators: AsyncIterator<any>[] = others.map((o) => (o as AsyncIterable<any>)[Symbol.asyncIterator]());
        let error: any;

        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (error) throw error;

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    for (const iterator of iterators) {
                        iterator.return?.(undefined);
                    }
                }
                return next(element as any);
            }

            if (element === DONE) {
                if (iteratorsDone.every(Boolean)) {
                    return next(DONE);
                }

                while (!iteratorsDone.every(Boolean)) {
                    for (const [i, iterator] of iterators.entries()) {
                        if (iteratorsDone[i]) continue;

                        const item = await iterator.next();
                        if (item.done) {
                            iteratorsDone[i] = true;
                            continue;
                        }

                        latest[i + 1] = item.value;

                        if (latest.every((v) => v !== ARRAY_EMPTY_SLOT)) {
                            buffer.push(latest.slice() as [T, ...R]);
                        }
                    }
                }

                if (buffer.length) {
                    return forwardAnd(next, buffer, DONE);
                }
                return next(DONE);
            }

            latest[0] = element;

            if (latest.every((v) => v !== ARRAY_EMPTY_SLOT)) {
                buffer.push(latest.slice() as [T, ...R]);
            }

            for (const [i, iterator] of iterators.entries()) {
                if (iteratorsDone[i]) continue;

                const item = await iterator.next();
                if (item.done) {
                    iteratorsDone[i] = true;
                    continue;
                }

                latest[i + 1] = item.value;

                if (latest.every((v) => v !== ARRAY_EMPTY_SLOT)) {
                    buffer.push(latest.slice() as [T, ...R]);
                }
            }

            if (buffer.length) {
                return forward(next, buffer.splice(0, buffer.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;
    return op;
}