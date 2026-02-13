import { Pipe } from "../pipe.js";

export function distinctUntilKeyChanged(key: string, comparator?: (previous: any, current: any) => boolean): Pipe {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;

    return () => {
        let lastValue: any;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done || !result.value?.hasOwnProperty(key) || !lastValue?.hasOwnProperty(key) || !comparator(lastValue[key], result.value[key])) {
                lastValue = result.value;
                return result;
            }
        };
    }
}