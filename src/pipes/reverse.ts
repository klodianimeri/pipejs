import { Pipe, PipeIteratorResult } from "../pipe.js";

export function reverse<I>(): Pipe<I, I> {
    return () => {
        let buffer: Array<IteratorResult<I>> = new Array<IteratorResult<I>>();
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                buffer = buffer.reverse();
                buffer.push(result);
                return buffer;
            }

            buffer.push(result);
        };
    }
}