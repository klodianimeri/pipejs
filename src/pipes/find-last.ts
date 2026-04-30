import { Pipe, PipeIteratorResult } from "../pipe.js";

export function findLast<I>(predicate: (element: I, index: number) => boolean): Pipe<I, I> {
    return () => {
        let i: number = -1;
        let last: I | undefined;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return typeof last === 'undefined' ? result : [{ value: last }, result];
            }
            ++i;
            if (predicate(result.value, i)) {
                last = result.value;
            }
        };
    }
}