import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    forward,
} from "../pipe.js";
import { isIterable } from "../util/index.js";

function _flat<T>(item: T | Iterable<any>, depth: number = 1): any[] {
    if (depth < 0) {
        throw new Error("Depth must be non-negative");
    }

    const result: any[] = [];

    function walk(value: unknown, remaining: number): void {
        if (remaining === 0 || !isIterable(value)) {
            result.push(value);
            return;
        }
        for (const element of value) {
            walk(element, remaining - 1);
        }
    }

    walk(item, depth);
    return result;
}

/**
 * Flattens nested iterables up to `depth` levels (default 1).
 * Output element type is approximated as `any` because it depends on depth.
 */
export function flat<I>(depth?: number): Operator<I, any> {
    const maxDepth = typeof depth === "number" && depth >= 1 ? depth : 1;

    return <NextOut = unknown>(next: Pipe<any, NextOut>): Pipe<I, NextOut> => {
        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!isIterable(element)) {
                return next(element as any);
            }

            return forward(next, _flat(element, maxDepth));
        };
    };
}