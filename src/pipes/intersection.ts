import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function intersection<I, T1>(
    source1: Iterable<T1>
): Pipe<I, I | T1>;

export function intersection<I, T1, T2>(
    source1: Iterable<T1>,
    source2: Iterable<T2>
): Pipe<I, I | T1 | T2>;

export function intersection<I, T1, T2, T3>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>
): Pipe<I, I | T1 | T2 | T3>;

export function intersection<I, T1, T2, T3, T4>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>
): Pipe<I, I | T1 | T2 | T3 | T4>;

export function intersection<I, T1, T2, T3, T4, T5>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>,
    source5: Iterable<T5>
): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;

export function intersection<I>(
    ...sources: Array<Iterable<any>>
): Pipe<I, I | any>;

export function intersection<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any> {
    assertSyncs(sources);

    return () => {
        let allSourcesItems: Array<any> = [];

        for (const source of sources) {
            allSourcesItems.push(...source);
        }

        const sourceSet: Set<any> = new Set<any>(allSourcesItems);

        return (result: IteratorResult<I>): PipeIteratorResult<I | any> => {
            if (result?.done) {
                return result as IteratorResult<I | any>;
            }

            if (sourceSet.has(result.value)) {
                sourceSet.delete(result.value);
                return result as IteratorResult<I | any>;
            }
        };
    }
}