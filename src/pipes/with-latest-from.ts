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
} from "../pipe.js";

import { ARRAY_EMPTY_SLOT, assertAsyncs } from "../util/index.js";

export function withLatestFrom<T, R extends any[]>(...others: { [K in keyof R]: AsyncIterable<R[K]> }): Operator<T, [T, ...R]> {
    assertAsyncs(others)

    const op = <NextOut = unknown>(next: Pipe<[T, ...R], NextOut>): Pipe<T, NextOut> => {
        const latest: any[] = new Array(others.length + 1).fill(ARRAY_EMPTY_SLOT);
        let closed: boolean = false;
        let error: any;

        for (const [i, other] of others.entries()) {
            (async () => {
                try {
                    for await (const item of other) {
                        if (closed) break;
                        latest[i + 1] = item;
                    }
                } catch (err) {
                    error = err;
                }
            })();
        }

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (error) {
                closed = true;
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) closed = true;
                return next(element as any);
            }

            if (element === DONE) {
                closed = true;
                return next(DONE);
            }

            latest[0] = element;

            if (latest.every(v => v !== ARRAY_EMPTY_SLOT)) {
                return next(latest.slice(0, latest.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}