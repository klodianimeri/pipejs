import { Pipe } from "../pipe.js";

export function entries(): Pipe {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): IteratorResult<any> => {

            if (result?.done) {
                return result;
            }

            ++i;

            result.value = [i, result.value];

            return result;
        };
    }
}