import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function concat<I, T1>(
    source1: Iterable<T1>
): Pipe<I, I | T1>;

export function concat<I, T1, T2>(
    source1: Iterable<T1>,
    source2: Iterable<T2>
): Pipe<I, I | T1 | T2>;

export function concat<I, T1, T2, T3>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>
): Pipe<I, I | T1 | T2 | T3>;

export function concat<I, T1, T2, T3, T4>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>
): Pipe<I, I | T1 | T2 | T3 | T4>;

export function concat<I, T1, T2, T3, T4, T5>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source3: Iterable<T3>,
    source4: Iterable<T4>,
    source5: Iterable<T5>
): Pipe<I, I | T1 | T2 | T3 | T4 | T5>;

export function concat<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any> {
    assertSyncs(sources);

    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<I | any> => {
            if (result?.done) {

                let results: PipeIteratorResult<I | any> = new Array<IteratorResult<I | any>>();

                for (const source of sources) {
                    for (const item of source) {
                        results.push(Object({ value: item }));
                    }
                }

                results.push(result);

                return results;
            }

            return result;
        };
    }
}