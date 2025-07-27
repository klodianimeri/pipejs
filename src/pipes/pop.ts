import { Pipe } from "../pipe.js";

export function pop(): Pipe {
    return () => {
        let last: any;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done) {
                return result;
            }
            let lastResult = last;
            last = result;
            if (typeof last !== "undefined") {
                return lastResult;
            }
        };
    }
}