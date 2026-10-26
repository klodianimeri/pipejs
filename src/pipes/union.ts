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
 * Set union: A ∪ B ∪ C ∪ …
 * Emits each distinct value once (main first, then others).
 */
export function union<I>(...sources: Array<Iterable<I>>): Operator<I, I> {
    assertSyncs(sources);

    return <NextOut = unknown>(
        next: Pipe<I, NextOut>
    ): Pipe<I, NextOut> => {
        const seen = new Set<I>();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                const batch: I[] = [];

                for (const source of sources) {
                    for (const item of source) {
                        if (!seen.has(item as I)) {
                            seen.add(item as I);
                            batch.push(item as I);
                        }
                    }
                }

                return forwardAnd(next, batch, DONE);
            }

            const value = element as I;

            if (!seen.has(value)) {
                seen.add(value);
                return next(value);
            }

            return BREAK;
        };
    };
}