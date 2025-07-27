import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function average(): Pipe {
    return () => {
        let count: number = 0;
        let sum: number = 0;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return count === 0 ? result : [Yield(sum / count), result];
            }

            if (typeof result.value === 'number') {
                ++count;
                sum += result.value;
            }
        };
    }
}