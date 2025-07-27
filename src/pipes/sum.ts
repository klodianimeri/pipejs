import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function sum(): Pipe {
    return () => {
        let sum: number = 0;
        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            if (result?.done) {
                return [Yield(sum), result];
            }
            if (typeof result.value === 'number') {
                sum += result.value;
            }
        };
    }
}