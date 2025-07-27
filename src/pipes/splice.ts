import { Pipe } from "../pipe.js";
import { Yields } from "../util/yields.js";

export function splice(start: number, deleteCount: number, ...elements: Array<any>): Pipe {
    start = (typeof start === 'number' && start >= 0) ? start : 0;
    deleteCount = (typeof deleteCount === 'number' && deleteCount >= 0) ? deleteCount : 0;
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;
            if (i < start || i >= (start + deleteCount)) {
                return result;
            } else if (i === start && Array.isArray(elements)) {
                return Yields(elements);
            }
        };
    }
}