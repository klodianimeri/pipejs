import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    forwardAnd,
} from "../pipe.js";
import { assertSyncs } from "../util/index.js";

/**
 * Symmetric difference: elements that appear in an odd number of the sets
 * (main + each other source).
 *
 * A △ B △ C △ …
 */
export function symmetricDifference<I>(...sources: Array<Iterable<I>>): Operator<I, I> {
    assertSyncs(sources);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const odd = new Set<I>();

        const toggle = (value: I) => {
            if (odd.has(value)) odd.delete(value);
            else odd.add(value);
        };

        for (const source of sources) {
            const seen = new Set<I>();
            for (const item of source) {
                if (!seen.has(item)) {
                    seen.add(item);
                    toggle(item as I);
                }
            }
        }

        const seenMain = new Set<I>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return forwardAnd(next, odd, DONE);
            }

            const value = element as I;

            if (!seenMain.has(value)) {
                seenMain.add(value);
                toggle(value);
            }

            return BREAK;
        };
    };
}