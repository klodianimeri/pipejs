import { Pipe, PipeIteratorResult } from "../pipe.js";

export function at<I>(index: number): Pipe<I, I> {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }

            ++i;

            if (i === index) {
                return [result, { done: true, value: undefined }];
            }
        };
    }
}