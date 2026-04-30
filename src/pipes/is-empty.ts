import { Pipe, PipeIteratorResult } from "../pipe.js";

export function isEmpty<I>(): Pipe<I, boolean> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<boolean> => {
            return result?.done ? [{ value: true }, result] : [{ value: false }, { done: true, value: undefined }];
        };
    }
}
