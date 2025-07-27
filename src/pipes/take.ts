import { Pipe } from "../pipe.js";
import { Done, positiveInfinity } from "../util/index.js";

export function take(count: number): Pipe {
    count = (typeof count === "number" && count > 0) ? count : positiveInfinity();
    return () => {
        var i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (i >= count) {
                return Done();
            }
            return result;
        };
    }
}