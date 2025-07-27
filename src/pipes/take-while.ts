import { Pipe } from "../pipe.js";
import { Done } from "../util/index.js";

export function takeWhile(predicate: (element: any, inclusive?: number) => boolean, inclusive?: boolean): Pipe {
    inclusive = typeof inclusive === 'boolean' ? inclusive : false;

    return () => {
        var i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> | Array<IteratorResult<any>> => {
            ++i;

            if (result?.done) {
                return result;
            }

            if (!predicate(result.value, i)) {
                if (inclusive) {
                    return [result, Done()]
                }

                return Done();
            }

            return result;
        };
    }
}