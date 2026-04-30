import { Pipe, PipeIteratorResult } from "../pipe.js";

export function ignoreElements<I>(): Pipe<I, never> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<never> => {
            if (result?.done) {
                return result as IteratorResult<never>;
            }
        };
    }
}