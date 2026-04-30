import { Pipe, PipeIteratorResult } from "../pipe.js";

export function count<I>(): Pipe<I, number> {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            ++i;
            if (result?.done) {
                return [{ value: i }, result];
            }
        };
    }
}