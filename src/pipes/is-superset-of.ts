import { Pipe } from "../pipe.js";
import { assertSync, Yield } from "../util/index.js";

export function isSupersetOf(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    return () => {
        let sourceSet: Set<any> = source instanceof Set ? source : new Set<any>(source);

        let found: number = 0;

        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            if (result?.done) {
                return found === sourceSet.size ? [Yield(true), result] : [Yield(false), result];
            }

            if (sourceSet.has(result.value)) {
                ++found;
            }
        };
    }
}