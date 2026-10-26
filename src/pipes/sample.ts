import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    ErrorControl,
    IS_ASYNC_OPERATOR
} from "../pipe.js";

import { assertAsync } from "../util/index.js";

export function sample<T = unknown>(notifier: AsyncIterable<any>): Operator<T, T> {
    assertAsync(notifier);

    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let lastValue: T | undefined;
        let hasValue = false;
        let shouldEmit = false;
        let closed = false;
        let error: any;

        // background notifier
        (async () => {
            try {
                for await (const _ of notifier) {
                    if (closed) break;
                    shouldEmit = true;
                }
            } catch (err) {
                error = err;
            }
        })();

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (error) {
                closed = true;
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) closed = true;
                return next(element);
            }

            if (element === DONE) {
                closed = true;
                return next(DONE);
            }

            if (shouldEmit && hasValue) {
                shouldEmit = false;
                hasValue = false;
                return next(lastValue as any);
            }

            // keep latest value
            lastValue = element as T;
            hasValue = true;

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}