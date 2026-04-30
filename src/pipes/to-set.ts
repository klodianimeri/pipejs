import { Pipe, PipeIteratorResult } from "../pipe.js";

export function toSet<I>(): Pipe<I, Set<I>> {
    return () => {
        let buffer: Set<I> = new Set<I>();
        return (result: IteratorResult<I>): PipeIteratorResult<Set<I>> => {
            if (result?.done) {
                return [{ value: buffer }, result];
            }

            buffer.add(result.value);
        };
    }
}