import {
    Operator,
    Pipe,
    PipeResult,
    DONE,
    CONTINUE,
    BREAK,
    start,
    terminal,
    PipeResults,
    ErrorControl,
} from "../pipe.js";

// ---------- Overloads (up to 10 operators) ----------

export function pipeAsync<TSource>(
    source: AsyncIterable<TSource>
): AsyncIterable<TSource>;

export function pipeAsync<TSource, T1>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>
): AsyncIterable<T1>;

export function pipeAsync<TSource, T1, T2>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>
): AsyncIterable<T2>;

export function pipeAsync<TSource, T1, T2, T3>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>
): AsyncIterable<T3>;

export function pipeAsync<TSource, T1, T2, T3, T4>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>
): AsyncIterable<T4>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>
): AsyncIterable<T5>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>
): AsyncIterable<T6>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>
): AsyncIterable<T7>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>,
    op8: Operator<T7, T8>
): AsyncIterable<T8>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    source: AsyncIterable<TSource>,
    op1: Operator<TSource, T1>,
    op2: Operator<T1, T2>,
    op3: Operator<T2, T3>,
    op4: Operator<T3, T4>,
    op5: Operator<T4, T5>,
    op6: Operator<T5, T6>,
    op7: Operator<T6, T7>,
    op8: Operator<T7, T8>,
    op9: Operator<T8, T9>
): AsyncIterable<T9>;

export function pipeAsync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    source: AsyncIterable<TSource>,
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
): AsyncIterable<T10>;

export function pipeAsync(source: AsyncIterable<any>, ...operators: Operator<any, any>[]): AsyncIterable<any>;

export function pipeAsync(source: AsyncIterable<any>, ...operators: Operator<any, any>[]): AsyncIterable<any> {
    if (!source || typeof source[Symbol.asyncIterator] !== "function") {
        throw new Error(`Source ${source} is not an async iterable`);
    }

    const ops = operators.filter((o) => typeof o === "function");


    if (ops.length === 0) {
        return source;
    }

    let current: Pipe<any, any> = terminal;

    return {
        async *[Symbol.asyncIterator]() {

            for (let i = ops.length - 1; i >= 0; i--) {
                current = ops[i](current);
            }

            const head = start(current);

            const results: any[] = [];
            let done = false;

            const handle = async (result: PipeResult | Promise<PipeResult>): Promise<boolean> => {
                result = await result;

                if (result instanceof PipeResults) {
                    for (const item of result) {
                        if (item instanceof CONTINUE) {
                            if (item instanceof ErrorControl) {
                                results.push(item);
                                return true;
                            }
                            continue;
                        }
                        if (item === BREAK) continue;
                        if (item === DONE) return true;
                        results.push(item);
                    }
                    return false;
                }

                if (result instanceof CONTINUE) {
                    if (result instanceof ErrorControl) {
                        results.push(result);
                        return true;
                    }
                    return false;
                }
                if (result === BREAK) return false;
                if (result === DONE) return true;

                results.push(result);
                return false;
            };

            for await (const element of source) {
                if (await handle(head(element))) {
                    done = true;
                    break;
                }

                for (const element of results) {
                    if (element instanceof ErrorControl) throw element.error;
                    yield element;
                }

                results.length = 0;
            }


            if (!done) {
                await handle(head(DONE));
            }

            for (const element of results) {
                if (element instanceof ErrorControl) throw element.error;
                yield element;
            }
        },
    };
}