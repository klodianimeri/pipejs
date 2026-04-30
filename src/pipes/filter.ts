import { Pipe, PipeIteratorResult } from "../pipe.js";

export function filter<I>(predicate: (element: I, index: number) => boolean): Pipe<I, I> {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {

            if (result?.done) {
                return result;
            }

            ++i;

            if (!predicate(result.value, i)) return;

            return result;
        };
    }
}
