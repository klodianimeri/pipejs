import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK, forward } from "../pipe.js";
import { assertSync } from "../util/assert-sync.js";

export function innerJoin<I, TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (value: I) => TKey,
    innerKeySelector: (value: TInner) => TKey,
    resultSelector: (outer: I, inner: TInner) => TResult
): Operator<I, TResult> {
    assertSync(inner);
    return <NextOut = unknown>(next: Pipe<TResult, NextOut>): Pipe<I, NextOut> => {

        const innerLookup = new Map<TKey, Array<TInner>>();

        for (const item of inner) {
            const key = innerKeySelector(item);
            let list = innerLookup.get(key);
            if (list === undefined) {
                list = [];
                innerLookup.set(key, list);
            }
            list.push(item);
        }

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const outerItem = element as I;
            const matches = innerLookup.get(outerKeySelector(outerItem));

            if (matches === undefined || matches.length === 0) {
                return BREAK;
            }

            const buffer: any[] = [];

            for (let i = 0; i < matches.length; i++) {
                buffer.push(resultSelector(outerItem, matches[i]));
            }

            return forward(next, buffer);
        };
    };
}
