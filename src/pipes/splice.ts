import { Pipe, PipeIteratorResult } from "../pipe.js";

export function splice<I, T>(start: number, deleteCount: number, ...elements: Array<T>): Pipe<I, I | T> {
    const s = (typeof start === 'number' && start >= 0) ? start : 0;
    const dc = (typeof deleteCount === 'number' && deleteCount >= 0) ? deleteCount : 0;
    return () => {
        let i: number = -1;
        let spliced: boolean = false;
        return (result: IteratorResult<I>): PipeIteratorResult<I | T> => {
            if (result?.done) {
                if (!spliced) {
                    spliced = true;
                    const results = elements.map(e => Object({ value: e }));
                    results.push(result);
                    return results;
                }
                return result;
            }

            ++i;

            if (i < s) {
                return result as IteratorResult<I | T>;
            }

            if (i === s) {
                spliced = true;
                const results = elements.map(e => Object({ value: e }));

                if (dc === 0) {
                    results.push(result);
                    return results;
                }

                return results;
            }

            if (i >= s + dc) {
                return result as IteratorResult<I | T>;
            }
        };
    }
}