import { Pipe } from "../pipe.js";
import { Done, Yield } from "../util/index.js";

export function isEmpty(): Pipe {
    return () => {
        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            return result?.done ? [Yield(true), result] : [Yield(false), Done()];
        };
    }
}