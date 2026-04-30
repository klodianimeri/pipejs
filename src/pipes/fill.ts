import { Pipe, PipeIteratorResult } from "../pipe.js";

export function fill<I, T>(value: T, start?: number, end?: number): Pipe<I, I | T> {
    const s = typeof start === 'number' ? start : 0;
    const e = typeof end === 'number' ? end : Infinity;
    return () => {
        let i = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I | T> => {
            ++i;
            if (!result?.done && i >= s && i < e) {
                (result as IteratorResult<I | T>).value = value;
            }
            return result as IteratorResult<I | T>;
        };
    }
}
