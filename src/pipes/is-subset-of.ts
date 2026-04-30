import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function isSubsetOf<I>(...sources: Array<Iterable<any>>): Pipe<I, boolean> {
    assertSyncs(sources);

    return () => {
        let allSourcesItems: Array<any> = [];

        for (const source of sources) {
            allSourcesItems.push(...source);
        }

        const sourceSet: Set<any> = new Set<any>(allSourcesItems);

        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            if (result?.done) {
                return [{ value: true }, result];
            }

            if (!sourceSet.has(result.value)) return [{ value: false }, { done: true, value: undefined }];
        };
    }
}
