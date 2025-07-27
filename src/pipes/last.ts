import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function last(): Pipe {
    return () => {
        let i: number = -1;
        let last: any;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return i === 0 ? result : [Yield(last), result];
            }
            last = result.value;
        };
    }
}