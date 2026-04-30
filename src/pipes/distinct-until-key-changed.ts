import { Pipe, PipeIteratorResult } from "../pipe.js";

export function distinctUntilKeyChanged<I extends Record<string, any>, K extends keyof I>(
    key: K,
    comparator?: (previous: I[K], current: I[K]) => boolean
): Pipe<I, I> {
    const comp = typeof comparator === 'function' ? comparator : (a: any, b: any) => a === b;

    return () => {
        let lastValue: I | undefined;

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result.done) return result;

            const currentValue = result.value;

            if (lastValue !== undefined && comp(lastValue[key], currentValue[key])) {
                return;
            }

            lastValue = currentValue;
            return result;
        };
    }
}