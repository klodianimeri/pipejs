import { Pipe } from "../pipe.js";
import { Yields, push, positiveInfinity } from "../util/index.js";

export function takeLast(count: number): Pipe {
    count = (typeof count === "number" && count > 0) ? count : positiveInfinity();

    return () => {
        let last: Array<any> = new Array<any>();
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (result?.done) {
                return push(Yields(last), result);
            }

            if (last.length === count) {
                last.shift();
            }

            last.push(result.value);
        };
    }
}