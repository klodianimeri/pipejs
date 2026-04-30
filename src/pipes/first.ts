import { Pipe, PipeIteratorResult } from "../pipe.js";

export function first<I>(): Pipe<I, I> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }
            return [result, { done: true, value: undefined }];
        };
    }
}