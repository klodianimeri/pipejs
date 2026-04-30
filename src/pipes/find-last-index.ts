import { Pipe, PipeIteratorResult } from "../pipe.js";

export function findLastIndex<I>(predicate: (element: I, index: number) => boolean, fromIndex?: number): Pipe<I, number> {
    const start = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        let lastIndex: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<number> => {
            if (result?.done) {
                return [{ value: lastIndex }, result];
            }

            ++i;

            if (i >= start && predicate(result.value, i)) {
                lastIndex = i;
            }
        };
    }
}
