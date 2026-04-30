import { Pipe, PipeIteratorResult } from "../pipe.js";

export function findIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Pipe<I, number> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            if (result?.done) {
                return result as any;
            }

            ++i;

            if (i >= start && predicate(result.value, i)) {
                return [{ value: i }, { done: true, value: undefined }];
            }
        };
    }
}