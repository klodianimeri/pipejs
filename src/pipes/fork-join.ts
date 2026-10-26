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
    done,
} from "../pipe.js";

import { allSettled, ARRAY_EMPTY_SLOT, assertAsyncs } from "../util/index.js";

// ---------- Overloads ----------

export function forkJoin<I, T1>(
    source1: AsyncIterable<T1>
): Operator<I, [I, T1]>;

export function forkJoin<I, T1, T2>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>
): Operator<I, [I, T1, T2]>;

export function forkJoin<I, T1, T2, T3>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>
): Operator<I, [I, T1, T2, T3]>;

export function forkJoin<I, T1, T2, T3, T4>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>
): Operator<I, [I, T1, T2, T3, T4]>;

export function forkJoin<I, T1, T2, T3, T4, T5>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>,
    source5: AsyncIterable<T5>
): Operator<I, [I, T1, T2, T3, T4, T5]>;

export function forkJoin<I>(
    ...sources: AsyncIterable<any>[]
): Operator<I, any[]>;

export function forkJoin<I>(...sources: AsyncIterable<any>[]): Operator<I, any[]> {
    assertAsyncs(sources);

    const op = <NextOut = unknown>(
        next: Pipe<any[], NextOut>
    ): Pipe<I, NextOut> => {
        const tasks: Promise<void>[] = [];
        const latest: any[] = new Array(sources.length + 1).fill(ARRAY_EMPTY_SLOT);
        let closed = false;
        let error: any;

        for (const [i, other] of sources.entries()) {
            tasks.push((async () => {
                try {
                    for await (const item of other) {
                        if (closed) break;
                        latest[i + 1] = item;
                    }
                } catch (err) {
                    error = err;
                }
            })());
        }

        return async (element: PipeArgument<I>): Promise<PipeResult<NextOut>> => {
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

                if (latest.every(v => v !== ARRAY_EMPTY_SLOT)) {
                    return done(next, latest as any);
                }

                return next(DONE);
            }

            latest[0] = element;
            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}