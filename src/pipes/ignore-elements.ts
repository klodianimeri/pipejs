import { Pipe } from "../pipe.js";

export function ignoreElements(): Pipe {
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done) {
                return result;
            }
        };
    }
}