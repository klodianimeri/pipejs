import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function difference<I>(...sources: Array<Iterable<I>>): Operator<I, I> {
    assertSyncs(sources);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const excluded = new Set<any>();

        for (const source of sources) {
            for (const item of source) {
                excluded.add(item);
            }
        }

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!excluded.has(element)) {
                excluded.add(element);
                return next(element);
            }

            return BREAK;
        };
    };
}
