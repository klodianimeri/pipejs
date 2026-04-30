import { Pipe, PipeIteratorResult } from "../pipe.js";

export function takeLast<I>(count: number): Pipe<I, I> {
    count = (typeof count === "number" && count > 0) ? count : 0;

    return () => {
        let last: Array<IteratorResult<I>> = new Array<IteratorResult<I>>();
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                last.push(result);
                return last;
            }

            if (last.length === count) {
                last.shift();
            }

            last.push(result);
        };
    }
}
