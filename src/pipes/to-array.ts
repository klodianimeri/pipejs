import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function toArray(): Pipe {
    return () => {
        let buffer: Array<any> = new Array<any>();
        var i: number = -1;

        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(buffer), result];
            }

            buffer.push(result.value);
        };
    }
}