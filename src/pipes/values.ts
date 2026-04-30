import { Pipe, PipeIteratorResult } from "../pipe.js";

export function values<I>(): Pipe<I, I extends [any, infer V] ? V : I> {
    return () => {
        return (result: IteratorResult<I>): PipeIteratorResult<I extends [any, infer V] ? V : I> => {
            if (!result.done) {
                if (Array.isArray(result.value) && result.value.length == 2)
                    (result).value = result.value[1];
            }
            return result as PipeIteratorResult<I extends [any, infer V] ? V : I>;
        };
    }
}