import { Pipe } from "../pipe.js";
import { Yield, Done } from "../util/index.js";

export function some(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i = -1;
        return (result: IteratorResult<any>): any => {
            if (result?.done) {
                return [Yield(false), result];
            }

            i++;

            if (predicate(result.value, i)) {
                return [Yield(true), Done()];
            }
        };
    }
}