import { Pipe } from "../pipe.js";

export function keys(): Pipe {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;
            if (!result?.done) {
                if (Array.isArray(result.value) && result.value.length == 2) {
                    result.value = result.value[0];
                } else {
                    result.value = i;
                }
            }
            return result;
        };
    }
}