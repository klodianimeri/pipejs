import { Pipe } from "../pipe.js";
import { Yield, Done } from "../util/index.js";

export function findIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number): Pipe {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return result;
            } else if (i >= fromIndex && predicate(result.value, i)) {
                return [Yield(i), Done()];
            }
        };
    }
}