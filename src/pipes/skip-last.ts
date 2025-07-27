import { Pipe } from "../pipe.js";
import { negativeInfinity } from "../util/index.js";

export function skipLast(count: number): Pipe {
    count = (typeof count === "number" && count > 0) ? count : negativeInfinity();
    return () => {
        let items: Array<any> = new Array<any>();
        return (result: IteratorResult<any>): IteratorResult<any> => {
            items.push(result);

            if (result.done) {
                return result;
            } else if (items.length > count) {
                return items.shift();
            }
        };
    }
}