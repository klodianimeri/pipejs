import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function difference<I>(...sources: Array<Iterable<any>>): Pipe<I, I> {
    assertSyncs(sources);

    return () => {
        let allSourcesItems: Array<any> = new Array<any>();

        for (const source of sources) {
            allSourcesItems.push(...source);
        }

        const sourceSet: Set<any> = new Set<any>(allSourcesItems);

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }

            if (!sourceSet.has(result.value)) {
                sourceSet.add(result.value);
                return result;
            }
        };
    }
}