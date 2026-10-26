import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
} from "../pipe.js";
import { assertSyncs } from "../util/index.js";

/**
 * Set intersection: emits values from the source that appear in
 * *every* other iterable (each value at most once).
 *
 * A ∩ B ∩ C ∩ …
 */
export function intersection<I>(...sources: Array<Iterable<I>>): Operator<I, I> {
    assertSyncs(sources);

    return <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        const sets = sources.map(source => {
            const s = new Set<I>();
            for (const item of source) s.add(item);
            return s;
        });

        const emitted = new Set<I>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            const value = element as I;

            const inAll = sets.length === 0 || sets.every(s => s.has(value));

            if (inAll && !emitted.has(value)) {
                emitted.add(value);
                return next(value);
            }

            return BREAK;
        };
    };
}