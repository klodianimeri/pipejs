import { Pipe, PipeIteratorResult } from "../pipe.js";

export function slice<I>(start: number, end?: number): Pipe<I, I> {
    const s = (typeof start === 'number' && start >= 0) ? start : 0;
    const e = (typeof end === 'number' && end > s) ? end : Infinity;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            ++i;
            if (result?.done) {
                return result;
            }

            if (i >= s && i < e) {
                return result;
            } else if (i === e) {
                return { done: true, value: undefined };
            }
        };
    }
}