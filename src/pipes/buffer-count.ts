import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function bufferCount(count: number, every?: number): Pipe {
    return () => {
        let buffer: Array<any> = new Array<any>();
        count = (typeof count === 'number' && count > 1) ? count : 1;
        every = (typeof every === 'number' && every > 1) ? every : count;

        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return buffer.length > 0 ? [Yield(buffer), result] : result;
            }
            buffer.push(result.value);
            if (buffer.length === count) {
                result.value = new Array<any>(...buffer);
                for (let i = 0; i < every; i++) {
                    buffer.shift();
                }
                return result;
            }
        };
    }
}