import { Pipe } from "../pipe.js";
import { assertSync, Yields, push } from "../util/index.js";

export function symmetricDifference(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    let exists: Set<any> = new Set<any>();

    return () => (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
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