import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function symmetricDifference<I, T1>(
    source1: Iterable<T1>
): Pipe<I, I | T1>;

export function symmetricDifference<I, T1, T2>(
    source1: Iterable<T1>,
    source2: Iterable<T2>
): Pipe<I, I | T1 | T2>;

export function symmetricDifference<I, T1, T2, T3>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>
): Pipe<I, I | T1 | T2 | T3>;

export function symmetricDifference<I, T1, T2, T3, T4>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>
): Pipe<I, I | T1 | T2 | T3 | T4>;

export function symmetricDifference<I, T1, T2, T3, T4, T5>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>,
    source5: Iterable<T5>
): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;

export function symmetricDifference<I>(
    ...sources: Array<Iterable<any>>
): Pipe<I, I | any>;

export function symmetricDifference<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any> {
    assertSyncs(sources);

    let buffer: Set<I | any> = new Set<I | any>();

    return () => (result: IteratorResult<I>): PipeIteratorResult<I | any> => {
        if (result?.done) {
            let results: Array<any> = new Array<any>();

            for (const source of sources) {
                for (const item of source) {
                    if (!buffer.has(item)) {
                        buffer.add(item);
                        results.push({ value: item });
                    }
                }
            }

            results.push(result);
            return results;
        }

        if (!buffer.has(result.value)) {
            buffer.add(result.value);
            return result;
        }
    };
}