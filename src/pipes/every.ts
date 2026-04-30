import { Pipe, PipeIteratorResult } from "../pipe.js";

export function every<I>(predicate: (element: I, index: number) => boolean): Pipe<I, boolean> {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            if (result?.done) {
                return [{ value: true }, result];
            }

            ++i;

            if (!predicate(result.value, i)) {
                return [{ value: false }, { done: true, value: undefined }];
            }
        };
    }
}