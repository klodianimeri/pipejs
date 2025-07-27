import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function reduce(accumulator: (accumulator: any, currentValue: any, index?: number) => any, initialValue?: any): Pipe {
    return () => {
        let i: number = -1;
        let value: any;
        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            ++i;
            if (i === 0) {
                value = initialValue ?? result.value;
            }
            if (result?.done) {
                return [Yield(value), result];
            }

            value = accumulator(value, result.value, i);
        };
    }
}