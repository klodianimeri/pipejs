import { Pipe } from "../pipe.js";
import { assertSync, push, Yields } from "../util/index.js";

export function concat(source: Iterable<any, any, unknown>): Pipe {
    assertSync(source);

    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return push(Yields(Array.from(source)), result);
            }

            return result;
        };
    }
}