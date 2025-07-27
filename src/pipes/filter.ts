import { Pipe } from "../pipe.js";

export function filter(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {
            ++i;

            if (result?.done) {
                return result;
            }

            if (!predicate(result.value, i)) return;

            return result;
        };
    }
}