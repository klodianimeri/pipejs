import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE } from "../pipe.js";
import { assertSync } from "../util/index.js";

export function groupJoin<I, TInner, TKey, TResult>(inner: Iterable<TInner>, outerKeySelector: (value: I) => TKey, innerKeySelector: (value: TInner) => TKey, resultSelector: (outer: I, innerArgs: Iterable<TInner>) => TResult): Operator<I, TResult> {
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
            const key = outerKeySelector(outerItem);

            const matchedList = innerLookup.get(key) ?? [];

            const projectedResult = resultSelector(outerItem, matchedList);

            return next(projectedResult);
        };
    };
}
