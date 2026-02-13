import { Pipe } from "../pipe.js";

export function filter(predicate: (element: any, index?: number) => boolean): Pipe {
    return () => {
        let i: number = -1;
        return (result: IteratorResult<any>): IteratorResult<any> => {

            if (result?.done) {
                return result;
            }

            ++i;

            if (!predicate(result.value, i)) return;

            return result;
        };
    }
}