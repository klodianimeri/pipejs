import { Pipe, PipeIteratorResult } from "../pipe.js";

export function max(): Pipe<number, number> {
    return () => {
        let max: number = -Infinity;

        return (result: IteratorResult<number>): PipeIteratorResult<number> => {
            if (result?.done) {
                return max === (-Infinity) ? result : [{ value: max }, result];
            }

            if (typeof result.value === 'number' && !isNaN(result.value) && result.value > max) {
                max = result.value;
            }
        };
    }
}