import { Pipe } from "../pipe.js";

export function skipLast(count: number): Pipe {
    count = (typeof count === "number" && count > 0) ? count : 0;
    return () => {
        let items: Array<any> = new Array<any>();
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done) {
                return result;
            }

            items.push(result);

            if (items.length > count) {
                return items.shift();
            }
        };
    }
}