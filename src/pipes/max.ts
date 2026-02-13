import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function max(): Pipe {
    return () => {
        let max: number = -Infinity;

        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return max === (-Infinity) ? result : [Yield(max), result];
            } else if (typeof result.value === 'number' && result.value > max) {
                max = result.value;
            }
        };
    }
}