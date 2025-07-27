import { Pipe } from "../pipe.js";

export function scan(accumulator: (accumulator: any, currentValue: any, index?: number) => any, initialValue?: any): Pipe {
    return () => {
        let i: number = -1;
        let value: any;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (i === 0) {
                value = initialValue ?? result.value;
            }

            if (!result?.done) {
                result.value = value = accumulator(value, result.value, i);
            }

            return result;
        };
    }
}