import { Pipe } from "../pipe.js";
import { Done } from "../util/index.js";

export function find(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return result;
            }

            if (predicate(result.value, i)) {
                return [result, Done()];
            }
        };
    }
}