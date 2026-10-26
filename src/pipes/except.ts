import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function except<I>(second: Iterable<I>, keySelector?: (value: I) => any): Operator<I, I> {
    const selector = typeof keySelector === "function" ? keySelector : (value: I) => value;

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const exclusionSet = new Set<any>();

        if (second && typeof second[Symbol.iterator] === "function") {
            for (const item of second) {
                exclusionSet.add(selector(item));
            }
        }

        const yieldedSet = new Set<any>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(element);

            const value = element as I;
            const key = selector(value);

            if (exclusionSet.has(key) || yieldedSet.has(key)) {
                return BREAK;
            }

            yieldedSet.add(key);

            return next(element);
        };
    };
}
