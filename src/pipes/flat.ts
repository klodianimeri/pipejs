import { Pipe, PipeIteratorResult } from "../pipe.js";

export function flat<I>(depth?: number): Pipe<I, any> {
    const d = (typeof depth === 'number' && depth >= 1) ? depth : 1;
    return () => {
        return (result: IteratorResult<any>): PipeIteratorResult => {
            if (result?.done || !result.value || typeof result.value[Symbol.iterator] !== 'function') {
                return result;
            }

            return Array.from(result.value).flat(d).map((s) => Object({ value: s }));
        };
    }
}