import { Pipe } from "../pipe.js";

export function drop(count: number): Pipe {
    count = (typeof count === 'number' && count > 0) ? count : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done) {
                return result;
            }

            ++i;

            if (i >= count) {
                return result;
            }
        };
    }
}