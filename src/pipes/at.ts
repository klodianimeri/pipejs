import { Pipe } from "../pipe.js";
import { Done } from "../util/index.js";

export function at(index: number): Pipe {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;

            if (result?.done) {
                return result;
            }

            if (i === index) {
                return [result, Done()];
            }
        };
    }
}