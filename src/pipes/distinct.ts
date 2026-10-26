import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";

export function distinct<I, K = I>(keySelector?: (value: I) => K): Operator<I, I> {
    const selector = keySelector ?? ((e: I) => e as unknown as K);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const elements = new Set<K>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const key = selector(element as I);

            if (!elements.has(key)) {
                elements.add(key);
                return next(element);
            }

            return BREAK;
        };
    };
}
