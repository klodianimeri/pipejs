import { Pipe } from "../pipe.js";
import { Yield } from "../util/yield.js";

export function size(): Pipe {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(i), result];
            }
        };
    }
}