import { Pipe } from "../pipe.js";
import { assertSync } from "../util/index.js";

export function difference(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    return () => {
        let sourceSet: Set<any> = source instanceof Set ? source : new Set<any>(source);

        return (result: IteratorResult<any>): IteratorResult<any> => {
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