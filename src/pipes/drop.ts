import { Pipe, PipeIteratorResult } from "../pipe.js";

export function drop<I>(count: number): Pipe<I, I> {
    const skipCount = (typeof count === 'number' && count > 0) ? count : 0;

    return () => {
        let i = 0;

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }

            if (i >= skipCount) {
                return result;
            }

            i++;
        };
    }
}