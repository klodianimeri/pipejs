import { Pipe } from "../pipe.js";

export function distinct(keyselector?: (element: any) => any): Pipe {
    keyselector = typeof keyselector === 'function' ? keyselector : (e) => e;

    return () => {
        let elements: Set<any> = new Set<any>();

        return (result: IteratorResult<any>): IteratorResult<any> => {
            if (result?.done) {
                return result;
            }

            if (!elements.has(keyselector(result.value))) {
                elements.add(keyselector(result.value));
                return result;
            }
        };
    }
}