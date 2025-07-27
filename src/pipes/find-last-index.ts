import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function findLastIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number): Pipe {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i: number = -1;
        let lastIndex: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(lastIndex), result];
            }
            else if (predicate(result.value)) {
                lastIndex = i;
            }
        };
    }
}
