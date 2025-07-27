import { Pipe } from "../pipe.js";

export function mapTo(value: any): Pipe {
    return () => {
        return (result: IteratorResult<any>): IteratorResult<any> => {
            result.value = value;
            return result;
        };
    }
}