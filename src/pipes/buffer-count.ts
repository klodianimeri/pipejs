import { Pipe, PipeIteratorResult } from "../pipe.js";

export function bufferCount<I>(count: number, every?: number): Pipe<I, I[]> {
    return () => {
        let buffer: Array<I> = new Array<I>();
        const c = (typeof count === 'number' && count > 1) ? count : 1;
        const e = (typeof every === 'number' && every > 1) ? every : c;

        return (result: IteratorResult<I>): PipeIteratorResult<I[]> => {
            if (result?.done) {
                return buffer.length > 0 ? [{ value: buffer }, result] : result;
            }
            buffer.push(result.value);
            if (buffer.length === c) {
                (result as IteratorResult<I[]>).value = new Array<I>(...buffer);
                buffer.splice(0, e);
                return result as IteratorResult<I[]>;
            }
        };
    }
}