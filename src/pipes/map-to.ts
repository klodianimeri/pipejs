import { Pipe, PipeIteratorResult } from "../pipe.js";

export function mapTo<I, T>(value: T): Pipe<I, T> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<T> => {
            (result as IteratorResult<I>).value = value;
            return result as IteratorResult<T>;
        };
    }
}