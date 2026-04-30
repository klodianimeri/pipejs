import { Pipe, PipeIteratorResult } from "../pipe.js";

export function distinctUntilChanged<I>(comparator?: (previous: I, current: I) => boolean): Pipe<I, I> {
    const comp = typeof comparator === 'function' ? comparator : (a: I, b: I) => a === b;

    return () => {
        let lastValue: I;

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done || !comp(lastValue, result.value)) {
                lastValue = result.value;
                return result;
            }
        };
    }
}