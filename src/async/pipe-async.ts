import { Pipe, PipeIterator, PipeIteratorResult } from "../pipe.js";

export function pipeAsync<TSource, T1>(
    source: AsyncIterable<TSource>
): AsyncIterable<TSource>;

export function pipeAsync<TSource, T1>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>
): AsyncIterable<T1>;

export function pipeAsync<TSource, T1, T2>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>
): AsyncIterable<T2>;

export function pipeAsync<TSource, T1, T2, T3>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>
): AsyncIterable<T3>;

export function pipeAsync<TSource, T1, T2, T3, T4>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>
): AsyncIterable<T4>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>
): AsyncIterable<T5>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>
): AsyncIterable<T6>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>
): AsyncIterable<T7>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>
): AsyncIterable<T8>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>,
    p9: Pipe<T8, T9>
): AsyncIterable<T9>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    source: AsyncIterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>,
    p9: Pipe<T8, T9>,
    p10: Pipe<T9, T10>
): AsyncIterable<T10>;

export function pipeAsync(
    source: AsyncIterable<any>,
    ...pipes: Array<Pipe<any, any>>
): AsyncIterable<any>;

export async function* pipeAsync(source: AsyncIterable<any>, ...pipes: Array<Pipe>): AsyncIterable<any> {
    if (!source || typeof source[Symbol.asyncIterator] !== 'function') {
        throw new Error(`Source ${source} not an async iterator!`);
    }

    if (!Array.isArray(pipes) || pipes.length === 0) {
        yield* source;
        return;
    }

    let pipeIterators: Array<PipeIterator> = new Array<PipeIterator>();

    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }

    const length = pipeIterators.length;

    let iterator = source[Symbol.asyncIterator]();

    let iteratorResult: IteratorResult<any> = await iterator.next();

    while (true) {

        let done: boolean | undefined = iteratorResult.done;

        let results: Array<IteratorResult<any>> = new Array<IteratorResult<any>>(iteratorResult);

        for (let i = 0; i < length; i++) {
            const allpipeResults: Array<IteratorResult<any>> = new Array<IteratorResult<any>>();
            const isLastPipe: boolean = i === pipes.length - 1;

            for (let j = 0; j < results.length; j++) {
                const piperesult: PipeIteratorResult = pipeIterators[i](results[j]);

                if (piperesult === undefined) continue;

                if (Array.isArray(piperesult)) {
                    for (let e = 0; e < piperesult.length; e++) {
                        const item: IteratorResult<any> = piperesult[e];

                        if (item === undefined) continue;

                        if (!isLastPipe) {
                            allpipeResults.push(item);
                        } else {
                            if (item.done) return;
                            if ('value' in item) yield item.value;
                        }
                    }
                } else if (!isLastPipe) {
                    allpipeResults.push(piperesult);
                } else {
                    if (piperesult.done) return;
                    if ('value' in piperesult) yield piperesult.value;
                }
            }
            results = allpipeResults;
        }

        if (done) break;

        iteratorResult = await iterator.next();
    }
}
