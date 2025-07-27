import { Pipe } from "../pipe.js";
import { Yield, Done } from "../util/index.js";

export function every(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            ++i;
            if (result?.done) {
                return [Yield(true), result];
            } else if (!predicate(result.value, i)) {
                return [Yield(false), Done()];
            }
        };
    }
}