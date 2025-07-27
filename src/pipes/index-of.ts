import { Pipe } from "../pipe.js";
import { Done, Yield } from "../util/index.js";

export function indexOf(value: any, fromIndex?: number): Pipe {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(-1), result];
            }
            else if (i >= fromIndex && value === result.value) {
                return [Yield(i), Done()];
            }
        };
    }
}