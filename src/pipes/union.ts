import { Pipe } from "../pipe.js";
import { assertSync, push, Yields } from "../util/index.js";

export function union(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    return () => {
        let exists: Set<any> = new Set<any>();
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                let results: Array<any> = new Array<any>();

                for (const item of source) {
                    if (!exists.has(item)) {
                        exists.add(item);
                        results.push(item);
                    }
                }

                return push(Yields(results), result);
            }

            if (!exists.has(result.value)) {
                exists.add(result.value);
                return result;
            }
        };
    }
}