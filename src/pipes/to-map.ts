import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function toMap<TSource, TKey, TValue = TSource>(
    keySelector: (item: TSource) => TKey,
    valueSelector?: (item: TSource) => TValue
): Operator<TSource, Map<TKey, TValue>> {
    return <NextOut = unknown>(next: Pipe<Map<TKey, TValue>, NextOut>): Pipe<TSource, NextOut> => {

        const buffer = new Map<TKey, TValue>();
        const valSelect = typeof valueSelector === "function" ? valueSelector : ((x: TSource) => x as unknown as TValue);

        return (element: PipeArgument<TSource>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, buffer);
            }

            const item = element as TSource;
            const key = keySelector(item);
            const value = valSelect(item);

            buffer.set(key, value);

            return BREAK;
        };
    };
}
