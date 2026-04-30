import { Pipe, PipeIteratorResult } from "../pipe.js";

export function keys<I>(): Pipe<I, I extends [infer K, any] ? K : number> {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I extends [infer K, any] ? K : number> => {
            if (result?.done) {
                return result;
            }

            ++i;

            if (Array.isArray(result.value) && result.value.length == 2) {
                result.value = result.value[0];
            } else {
                (result as IteratorResult<number>).value = i;
            }

            return result as IteratorResult<I extends [infer K, any] ? K : number>;
        };
    }
}
