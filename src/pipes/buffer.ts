import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK, ErrorControl, IS_ASYNC_OPERATOR, PipeResults, done } from "../pipe.js";
import { assertAsync } from "../util/index.js";

export function buffer<T = unknown>(notifier: AsyncIterable<any>): Operator<T, T[]> {
    assertAsync(notifier);

    const op = <NextOut = unknown>(next: Pipe<T[], NextOut>): Pipe<T, NextOut> => {
        let buffer: Array<any> = new Array<any>();
        let closed: boolean = false;
        let shouldEmit: boolean = false;
        let error: any;
        let running: boolean = false;

        async function listen() {
            try {
                for await (const _ of notifier) {
                    if (closed) break;
                    shouldEmit = true;
                }
            } catch (err) {
                error = err;
            } finally {
                closed = true;
            }
        };

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (error) {
                throw error;
            }

            if (element instanceof CONTINUE) {
                if (element instanceof ErrorControl) {
                    closed = true;
                }
                return next(element);
            }

            if (element === DONE) {
                closed = true;
                if (buffer.length)
                    if (buffer.length > 0) {
                        return done(next, buffer);
                    }

                return next(DONE);
            }

            if (!running) {
                listen();
                running = true;
            }

            buffer.push(element);

            if (shouldEmit) {
                shouldEmit = false;
                return next(buffer.splice(0, buffer.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}