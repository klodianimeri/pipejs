import { Pipe } from "../pipe.js";
import { Yields, push } from "../util/index.js";

export function endWith(...elements: Array<any>): Pipe {
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result.done) {
                return push(Yields(elements), result);
            } else {
                return result;
            }
        };
    }
}