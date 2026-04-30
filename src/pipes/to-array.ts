import { Pipe, PipeIteratorResult } from "../pipe.js";

export function toArray<I>(): Pipe<I, I[]> {
    return () => {
        let buffer: Array<I> = new Array<I>();
        var i: number = -1;

        return (result: IteratorResult<I>): PipeIteratorResult<I[]> => {
            ++i;
            if (result?.done) {
                return [{ value: buffer }, result];
            }

            buffer.push(result.value);
        };
    }
}
