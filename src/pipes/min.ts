import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function min(): Pipe {
    return () => {
        let min: number = Infinity;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return min === Infinity ? result : [Yield(min), result];
            } else if (typeof result.value === 'number' && result.value < min) {
                min = result.value;
            }
        };
    }
}