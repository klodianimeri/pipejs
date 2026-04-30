import { Pipe, PipeIteratorResult } from "../pipe.js";

export function pop<I>(): Pipe<I, I> {
    return () => {
        let last: IteratorResult<I>;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }
            let lastResult = last;
            last = result;
            if (typeof lastResult !== "undefined") {
                return lastResult;
            }
        };
    }
}