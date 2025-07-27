import { Pipe } from "../pipe.js";

export function values(): Pipe {
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (!result.done) {
                if (Array.isArray(result.value) && result.value.length == 2)
                    result.value = result.value[1];
            }
            return result;
        };
    }
}