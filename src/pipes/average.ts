import { Pipe, PipeIteratorResult } from "../pipe.js";

export function average<I>(): Pipe<I, number> {
    return () => {
        let count: number = 0;
        let sum: number = 0;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            if (result?.done) {
                return count === 0 ? result : [{ value: sum / count }, result];
            }

            if (typeof result.value === 'number') {
                ++count;
                sum += result.value;
            }
        };
    }
}