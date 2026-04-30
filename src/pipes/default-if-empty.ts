import { Pipe, PipeIteratorResult } from "../pipe.js";

export function defaultIfEmpty<I, T>(value: T): Pipe<I, I | T> {
    return () => {
        let isempty: boolean = true;
        return (result: IteratorResult<I>): PipeIteratorResult<I | T> => {
            if (result?.done) {
                if (isempty) {
                    return [{ value }, result];
                }
            } else {
                isempty = false;
            }
            return result as IteratorResult<I | T>;
        };
    }
}