import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    IS_ASYNC_OPERATOR,
    forward,
    forwardAnd,
} from "../pipe.js";
import { assertAsyncs } from "../util/assert-async.js";
import { assertSyncs } from "../util/assert-sync.js";

// ---------- Sync overloads ----------

export function concatWith<I, T1>(
    source1: Iterable<T1>
): Operator<I, I | T1>;

export function concatWith<I, T1, T2>(
    source1: Iterable<T1>,
    source2: Iterable<T2>
): Operator<I, I | T1 | T2>;

export function concatWith<I, T1, T2, T3>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>
): Operator<I, I | T1 | T2 | T3>;

export function concatWith<I, T1, T2, T3, T4>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>
): Operator<I, I | T1 | T2 | T3 | T4>;

export function concatWith<I, T1, T2, T3, T4, T5>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>,
    source5: Iterable<T5>
): Operator<I, I | T1 | T2 | T3 | T4 | T5>;

export function concatWith<I>(
    ...sources: Iterable<any>[]
): Operator<I, I | any>;

export function concatWith<I>(...sources: Iterable<any>[]): Operator<I, I | any> {
    assertSyncs(sources);

    return <NextOut = unknown>(
        next: Pipe<I | any, NextOut>
    ): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                const buffer: any[] = [];

                for (const source of sources) {
                    for (const item of source) {
                        buffer.push(item);
                    }
                }

                return forwardAnd(next, buffer, DONE);
            }

            return next(element);
        };
    };
}


export function concatWithAsync<I, T1>(
    source1: AsyncIterable<T1>
): Operator<I, I | T1>;

export function concatWithAsync<I, T1, T2>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>
): Operator<I, I | T1 | T2>;

export function concatWithAsync<I, T1, T2, T3>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>
): Operator<I, I | T1 | T2 | T3>;

export function concatWithAsync<I, T1, T2, T3, T4>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>
): Operator<I, I | T1 | T2 | T3 | T4>;

export function concatWithAsync<I, T1, T2, T3, T4, T5>(
    source1: AsyncIterable<T1>,
    source2: AsyncIterable<T2>,
    source3: AsyncIterable<T3>,
    source4: AsyncIterable<T4>,
    source5: AsyncIterable<T5>
): Operator<I, I | T1 | T2 | T3 | T4 | T5>;

export function concatWithAsync<I>(
    ...sources: AsyncIterable<any>[]
): Operator<I, I | any>;

export function concatWithAsync<I>(...sources: AsyncIterable<any>[]): Operator<I, I | any> {
    assertAsyncs(sources);

    const op = <NextOut = unknown>(next: Pipe<I | any, NextOut>): Pipe<I, NextOut> => {
        return async (element: PipeArgument<I>): Promise<PipeResult<NextOut>> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                const buffer: any[] = [];

                for (const source of sources) {
                    for await (const item of source) {
                        buffer.push(item);
                    }
                }

                return forwardAnd(next, buffer, DONE);
            }

            return next(element);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;
    return op;
}