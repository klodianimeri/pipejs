import { Pipe } from "../pipe.js";

export function map(callbackFn: (element: any, index?: number) => any): Pipe {
    callbackFn = typeof callbackFn === 'function' ? callbackFn : (e) => e;

    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (result?.done) {
                return result;
            }

            result.value = callbackFn(result.value, i);
            return result;
        };
    }
}