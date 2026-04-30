import { Pipe, PipeIteratorResult } from "../pipe.js";

export function map<I, T>(callbackFn: (element: I, index: number) => T): Pipe<I, T> {
    const fn = typeof callbackFn === 'function' ? callbackFn : (e: any) => e;

    return () => {
        let i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<T> => {
            ++i;
            if (result?.done) {
                return result;
            }

            (result as any).value = fn(result.value, i);
            return result as unknown as IteratorResult<T>;
        };
    }
}
