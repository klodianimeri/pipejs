import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function isSupersetOf<I>(...sources: Array<Iterable<any>>): Pipe<I, boolean> {
    assertSyncs(sources);

    return () => {
        let allSourcesItems: Array<any> = [];

        for (const source of sources) {
            allSourcesItems.push(...source);
        }

        const sourceSet: Set<any> = new Set<any>(allSourcesItems);

        let found: number = 0;

        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            if (result?.done) {
                return found === sourceSet.size ? [{ value: true }, result] : [{ value: false }, result];
            }

            if (sourceSet.has(result.value)) {
                ++found;
            }
        };
    }
}