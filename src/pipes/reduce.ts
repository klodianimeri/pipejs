import { Pipe, PipeIteratorResult } from "../pipe.js";

export function reduce<I, T>(
    accumulator: (acc: T, currentValue: I, index: number) => T,
    initialValue?: T
): Pipe<I, T> {
    return () => {
        let i: number = -1;
        let value: T;
        return (result: IteratorResult<I>): PipeIteratorResult<T> => {
            ++i;
            if (i === 0) {
                value = initialValue ?? (result.value as unknown as T);
            }

            if (result?.done) {
                return [{ value }, result];
            }

            value = accumulator(value, result.value, i);
        };
    }
}