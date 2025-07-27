import { Pipe } from "../pipe.js";
import { Yield, Done } from "../util/index.js";

export function some(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            if (result?.done) {
                return [Yield(false), result];
            } else if (predicate(result.value)) {
                return [Yield(true), Done()];
            }
        };
    }
}