import { Pipe } from "../pipe.js";
import { Done } from "../util/index.js";

export function first(): Pipe {
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return result;
            }

            return [result, Done()];
        };
    }
}