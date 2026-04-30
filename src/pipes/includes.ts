import { Pipe, PipeIteratorResult } from "../pipe.js";

export function includes<I>(value: I, fromIndex?: number): Pipe<I, boolean> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;

        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            if (result?.done) {
                return [{ value: false }, result];
            }

            ++i;

            if (i >= start && result.value === value) {
                return [{ value: true }, { done: true, value: undefined }];
            }
        };
    }
}