import { Yield, Done } from "../util/index.js";
import { Pipe } from "../pipe.js";

export function includes(value: any, fromIndex?: number): Pipe {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(false), result];
            }
            else if (i >= fromIndex && result.value === value) {
                return [Yield(true), Done()];
            }
        };
    }
}