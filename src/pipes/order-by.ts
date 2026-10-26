import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    DONE,
    forwardAnd,
} from "../pipe.js";

/**
 * Buffers all elements, sorts by keySelector (ascending by default),
 * then emits them in order. Optional comparer overrides default `<`/`>`.
 */
export function orderBy<I, K>(keySelector: (item: I) => K, comparer?: (a: K, b: K) => number): Operator<I, I> {
    const compare = typeof comparer === "function" ? comparer : (a: K, b: K): number => (a < b ? -1 : a > b ? 1 : 0);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                buffer.sort((x, y) => compare(keySelector(x), keySelector(y)));
                return forwardAnd(next, buffer, DONE);
            }

            buffer.push(element as I);

            return BREAK;
        };
    };
}