import { Pipe } from "../pipe.js";
import { Done } from "../util/done.js";

export function slice(start: number, end?: number): Pipe {
    start = (typeof start === 'number' && start >= 0) ? start : 0;
    end = (typeof end === 'number' && end > start) ? end : Infinity;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (result?.done) {
                return result;
            }

            if (i >= start && i < end) {
                return result;
            } else if (i === end) {
                return Done();
            }
        };
    }
}