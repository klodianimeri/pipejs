import { Pipe } from "../pipe.js";
import { assertSync, Done, Yield } from "../util/index.js";

export function isDisjointFrom(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    return () => {

        let sourceSet: Set<any> = source instanceof Set ? source : new Set<any>(source);

        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            if (result?.done) {
                return [Yield(true), result];
            }

            if (sourceSet.has(result.value)) {
                return [Yield(false), Done()];
            }
        };
    }
}