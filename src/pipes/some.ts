import { Pipe, PipeIteratorResult } from "../pipe.js";

export function some<I>(predicate: (element: I, index: number) => boolean): Pipe<I, boolean> {
    return () => {
        let i = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            if (result?.done) {
                return [{ value: false }, result];
            }

            i++;

            if (predicate(result.value, i)) {
                return [{ value: true }, { done: true, value: undefined }];
            }
        };
    }
}