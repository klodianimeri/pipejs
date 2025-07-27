import { Pipe } from "../pipe.js";
import { Yields, push } from "../util/index.js";

export function startWith(...elements: Array<any>): Pipe {
    return () => {
        let sent: boolean = false;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            if (!sent) {
                sent = true;
                return push(Yields(elements), result);
            }

            return result;
        };
    }
}