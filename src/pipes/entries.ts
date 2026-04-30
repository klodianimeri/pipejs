import { Pipe, PipeIteratorResult } from "../pipe.js";

export function entries<I>(): Pipe<I, [number, I]> {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<I>): PipeIteratorResult<[number, I]> => {

            if (result?.done) {
                return result;
            }

            ++i;

            (result as IteratorResult<[number, I]>).value = [i, result.value];

            return result as IteratorResult<[number, I]>;
        };
    }
}