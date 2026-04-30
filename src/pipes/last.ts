import { Pipe, PipeIteratorResult } from "../pipe.js";

export function last<T>(): Pipe<T, T> {
    return () => {
        let i: number = -1;
        let last: T;
        return (result: IteratorResult<T>): PipeIteratorResult<T> => {
            ++i;
            if (result?.done) {
                return i === 0 ? result : [{ value: last }, result];
            }
            last = result.value;
        };
    }
}