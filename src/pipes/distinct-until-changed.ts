import { Pipe } from "../pipe.js";

export function distinctUntilChanged(comparator?: (previous: any, current: any) => boolean): Pipe {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;

    return () => {
        let last: any;

        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done || !comparator(result.value, last)) {
                last = result.value;
                return result;
            }
        };
    }
}