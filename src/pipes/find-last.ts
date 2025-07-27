import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function findLast(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i: number = -1;
        let last: any;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return typeof last === 'undefined' ? result : [Yield(last), result];
            }
            if (predicate(result.value, i)) {
                last = result.value;
            }
        };
    }
}