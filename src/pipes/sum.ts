import { Pipe, PipeIteratorResult } from "../pipe.js";

export function sum<I>(): Pipe<I, number> {
    return () => {
        let sum: number = 0;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            if (result?.done) {
                return [{ value: sum }, result];
            }
            if (typeof result.value === 'number' && !isNaN(result.value)) {
                sum += result.value;
            }
        };
    }
}
