import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    forward,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";
import { isAsyncIterable } from "../util/index.js";

export function expand<T>(project: (value: T, index: number) => Iterable<T> | null | undefined): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let index = 0;

        const expandValue = (value: T): T[] => {
            const result: T[] = [value];
            const projected = project(value, index++);
            if (projected && typeof projected[Symbol.iterator] === "function") {
                for (const inner of projected) {
                    for (const innerElement of expandValue(inner)) {
                        result.push(innerElement);
                    }
                }
            }
            return result;
        };

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const expanded = expandValue(element as T);

            return forward(next, expanded);
        };
    };
}


/**
 * Recursively expands each value into an async iterable.
 * Emits the original value first, then recursively expands
 * everything produced by `project`.
 */
export function expandAsync<T>(project: (value: T, index: number) => AsyncIterable<T> | Promise<AsyncIterable<T>> | null | undefined): Operator<T, T> {
    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let index = 0;

        const expandValue = async (value: T): Promise<T[]> => {
            const result: T[] = [value];

            const projected = await project(value, index++);

            if (projected != null && isAsyncIterable(projected)) {
                for await (const inner of projected as AsyncIterable<T>) {
                    const innerExpanded = await expandValue(inner);
                    for (const innerElement of innerExpanded) {
                        result.push(innerElement);
                    }
                }
            }

            return result;
        };

        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const expanded = await expandValue(element as T);
            return forward(next, expanded);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}