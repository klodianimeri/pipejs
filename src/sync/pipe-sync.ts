import {
    Operator,
    Pipe,
    PipeResult,
    DONE,
    BREAK,
    CONTINUE,
    start,
    terminal,
    PipeResults,
    ErrorControl,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

// ---------- Overloads (up to 10 operators) ----------

export function pipeSync<TSource>(
    source: Iterable<TSource>
): Iterable<TSource>;

export function pipeSync<TSource, T1>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>
): Iterable<T1>;

export function pipeSync<TSource, T1, T2>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>
): Iterable<T2>;

export function pipeSync<TSource, T1, T2, T3>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>
): Iterable<T3>;

export function pipeSync<TSource, T1, T2, T3, T4>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>
): Iterable<T4>;

export function pipeSync<TSource, T1, T2, T3, T4, T5>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>
): Iterable<T5>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>
): Iterable<T6>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>
): Iterable<T7>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>,
    op8: Operator<T7, T8>
): Iterable<T8>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>,
    op8: Operator<T7, T8>,
    op9: Operator<T8, T9>
): Iterable<T9>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    source: Iterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>,
    op8: Operator<T7, T8>,
    op9: Operator<T8, T9>,
    op10: Operator<T9, T10>
): Iterable<T10>;

export function pipeSync(
    source: Iterable<any>,
    ...operators: Operator<any, any>[]
): Iterable<any>;

export function pipeSync(
    source: Iterable<any>,
    ...operators: Operator<any, any>[]
): Iterable<any> {
    if (!source || typeof source[Symbol.iterator] !== "function") {
        throw new Error(`Source ${String(source)} is not a sync iterable`);
    }

    const ops = operators.filter((o) => typeof o === "function");

    if (ops.length === 0) {
        return source;
    }

    let current: Pipe<any, any> = terminal;

    for (let i = ops.length - 1; i >= 0; i--) {
        const op = ops[i];

        if ((op as any)[IS_ASYNC_OPERATOR]) {
            throw new Error(`Operator at index ${i} is asynchronous and cannot be used in pipeSync.`);
        }

        current = op(current);
    }

    const head = start(current);

    return {
        *[Symbol.iterator]() {
            const results: any[] = [];
            let done = false;

            const handle = (result: PipeResult): boolean => {
                if (result instanceof PipeResults) {
                    for (const item of result) {
                        if (item === BREAK) continue;
                        if (item === DONE) return true;
                        if (item instanceof CONTINUE) {
                            if (item instanceof ErrorControl) {
                                results.push(item);
                                return true;
                            }
                            continue;
                        }

                        results.push(item);
                    }
                    return false;
                }


                if (result === BREAK) return false;
                if (result === DONE) return true;
                if (result instanceof CONTINUE) {
                    if (result instanceof ErrorControl) {
                        results.push(result);
                        return true;
                    }
                    return false;
                }

                results.push(result);
                return false;
            };

            for (const element of source) {
                if (handle(head(element))) {
                    done = true;
                    break;
                }
            }

            if (!done) {
                handle(head(DONE));
            }

            for (const element of results) {
                if (element instanceof ErrorControl) throw element.error;
                yield element;
            }
        },
    };
}