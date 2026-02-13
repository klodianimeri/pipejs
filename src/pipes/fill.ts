import { Pipe } from "../pipe.js";

export function fill(value: any, start?: number, end?: number): Pipe {
    start = typeof start === 'number' ? start : 0;
    end = typeof end === 'number' ? end : Infinity;
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