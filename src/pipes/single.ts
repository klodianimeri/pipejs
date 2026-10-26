import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    done,
} from "../pipe.js";

/**
 * Emits the single element of the sequence (optionally matching `predicate`).
 * Throws if the sequence is empty or contains more than one matching element.
 */
export function single<T>(predicate?: (value: T, index: number) => boolean): Operator<T, T> {
    const pred = predicate ?? (() => true);

    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let match: T | undefined;
        let found = false;
        let index = 0;

        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (!found) {
                    throw new Error("single: sequence is empty (no matching element)");
                }
                return done(next, match as T);
            }

            const value = element as T;
            const i = index++;

            if (pred(value, i)) {
                if (found) {
                    throw new Error("single: sequence contains more than one matching element");
                }

                match = value;
                found = true;
            }

            return BREAK;
        };
    };
}