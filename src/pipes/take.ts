import { Pipe, PipeIteratorResult } from "../pipe.js";

export function take<I>(count: number): Pipe<I, I> {
    const limit = (typeof count === "number" && count > 0) ? count : Infinity;
    return () => {
        var i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            ++i;
            if (i >= limit) {
                return { done: true, value: undefined };
            }
            return result;
        };
    }
}