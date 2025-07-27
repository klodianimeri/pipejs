import { Pipe } from "../pipe.js";
import { positiveInfinity } from "../util/index.js";

export function fill(value: any, start?: number, end?: number): Pipe {
    start = typeof start === 'number' ? start : 0;
    end = typeof end === 'number' ? end : positiveInfinity();
    return () => {
        let i = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (!result?.done && i >= start && i < end) {
                result.value = value;
            }
            return result;
        };
    }
}