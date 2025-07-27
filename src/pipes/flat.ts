import { Pipe } from "../pipe.js";
import { Yields } from "../util/index.js";

export function flat(depth?: number): Pipe {
    depth = (typeof depth === 'number' && depth >= 1) ? depth : 1;
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done || typeof result.value[Symbol.iterator] !== 'function') {
                return result;
            }

            return Yields(Array.from(result.value).flat(depth));
        };
    }
}