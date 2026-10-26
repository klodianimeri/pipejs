import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, PipeResults, done } from "../pipe.js";
import { assertSyncs } from "../util/index.js";

export function isSubsetOf<I>(...sources: Array<Iterable<any>>): Operator<I, boolean> {
    assertSyncs(sources);

    return <NextOut = unknown>(next: Pipe<boolean, NextOut>): Pipe<I, NextOut> => {

        const sourceSet = new Set<any>();

        for (let i = 0; i < sources.length; i++) {
            for (const item of sources[i]) {
                sourceSet.add(item);
            }
        }

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, true);
            }

            if (!sourceSet.has(element)) {
                return done(next, false);
            }

            return BREAK;
        };
    };
}
