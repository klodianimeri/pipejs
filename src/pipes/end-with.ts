import { Pipe, PipeIteratorResult } from "../pipe.js";

export function endWith<I, T>(...elements: Array<T>): Pipe<I, I | T> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<I | T> => {
            if (result.done) {
                const results = Array.from(elements).map((s) => Object({ value: s }))
                results.push(result);
                return results;
            } else {
                return result;
            }
        };
    }
}
