import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    BREAK,
    DONE,
    done,
} from "../pipe.js";

export function groupBy<I, K, V = I>(keySelector: (value: I) => K, elementSelector?: (value: I) => V): Operator<I, Map<K, V[]>> {
    const project = elementSelector ?? ((value: I) => value as unknown as V);

    return <NextOut = unknown>(next: Pipe<Map<K, V[]>, NextOut>): Pipe<I, NextOut> => {
        const groups = new Map<K, V[]>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, groups);
            }

            const value = element as I;
            const key = keySelector(value);

            let grouping = groups.get(key);
            if (grouping === undefined) {
                grouping = [];
                groups.set(key, grouping);
            }

            grouping.push(project(value));

            return BREAK;
        };
    };
}