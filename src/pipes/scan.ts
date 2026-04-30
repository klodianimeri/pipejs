import { Pipe, PipeIteratorResult } from "../pipe.js";

export function scan<I, T>(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T): Pipe<I, T> {
    return () => {
        let i: number = -1;
        let value: T;
        return (result: IteratorResult<I>): PipeIteratorResult<T> => {

            if (result?.done) {
                return result as unknown as IteratorResult<T>;
            }

            ++i;

            if (i === 0) {
                value = initialValue ?? (result.value as unknown as T);
            }

            value = accumulator(value, result.value, i);

            (result as unknown as IteratorResult<T>).value = value;

            return result as unknown as IteratorResult<T>;
        };
    }
}