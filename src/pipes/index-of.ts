import { Pipe, PipeIteratorResult } from "../pipe.js";

export function indexOf<I>(value: I, fromIndex?: number): Pipe<I, number> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            if (result?.done) {
                return [{ value: -1 }, result];
            }

            ++i;

            if (i >= start && value === result.value) {
                return [{ value: i }, { done: true, value: undefined }];
            }
        };
    }
}