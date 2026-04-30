import { Pipe, PipeIteratorResult } from "../pipe.js";

export function takeWhile<I>(predicate: (element: I, index: number) => boolean, inclusive?: boolean): Pipe<I, I> {
    const inc = typeof inclusive === 'boolean' ? inclusive : false;

    return () => {
        var i: number = -1;
        return (result: IteratorResult<I>): PipeIteratorResult<I> => {
            ++i;

            if (result?.done) {
                return result;
            }

            if (!predicate(result.value, i)) {
                if (inc) {
                    return [result, { done: true, value: undefined }];
                }

                return { done: true, value: undefined };
            }

            return result;
        };
    }
}
