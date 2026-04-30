import { Pipe, PipeIteratorResult } from "../pipe.js";

export function startWith<I, T>(...elements: Array<T>): Pipe<I, I | T> {
    return () => {
        let sent: boolean = false;
        return (result: IteratorResult<I>): PipeIteratorResult<I | T> => {
            if (!sent) {
                sent = true;
                const results = elements.map(e => Object({ value: e }));
                results.push(result);
                return results;
            }

            return result as IteratorResult<I | T>;
        };
    }
}