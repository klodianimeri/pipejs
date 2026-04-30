import { Pipe, PipeIteratorResult } from "../pipe.js";

export function distinct<I, K = I>(keyselector?: (element: I) => K): Pipe<I, I> {
    const selector = typeof keyselector === 'function' ? keyselector : (e: I) => e as unknown as K;

    return () => {
        const elements = new Set<K>();

        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            if (result?.done) {
                return result;
            }

            const key = selector(result.value);

            if (!elements.has(key)) {
                elements.add(key);
                return result;
            }
        };
    }
}
