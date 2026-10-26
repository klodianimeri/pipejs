import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    ErrorControl,
    IS_ASYNC_OPERATOR,
    forward,
    forwardAnd,
} from "../pipe.js";

import { allSettled, assertAsyncs } from "../util/index.js";

export function mergeWith<I, T1>(
    source1: AsyncIterable<T1>
): Operator<I, I | T1>;

export function mergeWith<I, T1, T2>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>
): Operator<I, I | T1 | T2>;

export function mergeWith<I, T1, T2, T3>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>
): Operator<I, I | T1 | T2 | T3>;

export function mergeWith<I, T1, T2, T3, T4>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>
): Operator<I, I | T1 | T2 | T3 | T4>;

export function mergeWith<I, T1, T2, T3, T4, T5>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>,
    source5: AsyncIterable<T5>
): Operator<I, I | T1 | T2 | T3 | T4 | T5>;

export function mergeWith<I>(...sources: Array<AsyncIterable<any>>): Operator<I, I> {
    assertAsyncs(sources);

    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const buffer: I[] = [];
        const tasks: Promise<void>[] = [];
        let closed = false;
        let error: any;

        tasks.push((async () => {
            try {
                for (const source of sources) {
                    for await (const v of source) {
                        if (closed) break;
                        buffer.push(v);
                    }
                }
            } catch (err) {
                error = err;
            }
        })());

        return async (element: PipeArgument<I>): Promise<PipeResult<NextOut>> => {
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

            buffer.push(element as I);

            return forward(next, buffer.splice(0, buffer.length));
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}