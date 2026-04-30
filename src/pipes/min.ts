import { Pipe, PipeIteratorResult } from "../pipe.js";

export function min(): Pipe<number, number> {
    return () => {
        let min: number = Infinity;
        return (result: IteratorResult<number>): PipeIteratorResult<number> => {
            if (result?.done) {
                return min === Infinity ? result : [{ value: min }, result];
            }

            if (typeof result.value === 'number' && !isNaN(result.value) && result.value < min) {
                min = result.value;
            }
        };
    }
}