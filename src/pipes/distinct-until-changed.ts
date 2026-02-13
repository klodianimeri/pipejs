import { Pipe } from "../pipe.js";

export function distinctUntilChanged(comparator?: (previous: any, current: any) => boolean): Pipe {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;

    return () => {
        let lastValue: any;

        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done || !comparator(lastValue, result.value)) {
                lastValue = result.value;
                return result;
            }
        };
    }
}