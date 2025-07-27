import { Pipe } from "../pipe.js";

export function distinctUntilKeyChanged(key: string, comparator?: (previous: any, current: any) => boolean): Pipe {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;

    return () => {
        let last: any;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done || !result.value?.hasOwnProperty(key) || !last?.hasOwnProperty(key) || !comparator(result.value[key], last[key])) {
                last = result.value;
                return result;
            }
        };
    }
}