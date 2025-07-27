import { Pipe } from "../pipe.js";
import { Yield } from "../util/index.js";

export function defaultIfEmpty(value: any): Pipe {
    return () => {
        let isempty: boolean = true;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                if (isempty) {
                    return [Yield(value), result];
                }
            } else {
                isempty = false;
            }
            return result;
        };
    }
}