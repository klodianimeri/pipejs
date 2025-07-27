import { Pipe } from "../pipe.js";

export function reverse(): Pipe {
    return () => {
        let buffer: Array<any> = new Array<any>();
        return (result: IteratorResult<any>): Array<IteratorResult<any>> => {
            if (result?.done) {
                return [...buffer, result];
            }
            buffer.unshift(result);
        };
    }
}