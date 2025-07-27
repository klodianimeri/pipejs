import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function toSet(): Pipe {
    return () => {
        let buffer: Set<any> = new Set<any>();
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return [Yield(buffer), result];
            }

            buffer.add(result.value);
        };
    }
}