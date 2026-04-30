import { Pipe, PipeIteratorResult } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function union<I>(...sources: Array<Iterable<any>>): Pipe<I, I | any> {
    assertSyncs(sources);

    return () => {
        let buffer: Set<I | any> = new Set<I | any>();

        return (result: IteratorResult<I>): PipeIteratorResult<I | any> => {
            if (result?.done) {
                let results: Array<any> = new Array<any>();

                for (const source of sources) {
                    for (const item of source) {
                        if (!buffer.has(item as any)) {
                            buffer.add(item as any);
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
}
