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
import { assertSyncs } from "../util/index.js";

/**
 * true iff main ⊇ (union of other sources)
 */
export function isSupersetOf<I>(...sources: Array<Iterable<any>>): Operator<I, boolean> {
    assertSyncs(sources);

    return <NextOut = unknown>(next: Pipe<boolean, NextOut>): Pipe<I, NextOut> => {
        const remaining = new Set<any>();

        for (const source of sources) {
            for (const item of source) {
                remaining.add(item);
            }
        }

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, remaining.size === 0);
            }

            if (remaining.has(element)) {
                remaining.delete(element);

                if (remaining.size === 0) {
                    return done(next, true);
                }
            }

            return BREAK;
        };
    };
}