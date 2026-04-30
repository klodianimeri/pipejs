import { Pipe, PipeIteratorResult } from "../pipe.js";

export function skipLast<I>(count: number): Pipe<I, I> {
    const skipCount = (typeof count === "number" && count > 0) ? count : 0;
    return () => {
        let items: Array<IteratorResult<I>> = new Array<IteratorResult<I>>();
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }

            items.push(result);

            if (items.length > skipCount) {
                return items.shift();
            }
        };
    }
}