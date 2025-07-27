import { Pipe } from "../pipe.js";

export function entries(): Pipe {
    return () => {
        let i: number = -1;

        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (!result.done && !Array.isArray(result.value)) {
                result.value = [i, result.value];
            }
            return result;
        };
    }
}