export const IS_ASYNC_OPERATOR = Symbol("%IS_ASYNC_OPERATOR");

export const DONE = Symbol('%DONE');
export const BREAK = Symbol('%BREAK');

export class CONTINUE { }

export type PipeControl = CONTINUE | typeof BREAK | typeof DONE;

export type PipeArgument<T = unknown> = T | CONTINUE | typeof DONE;

export class PipeResults<T = unknown> {
    #buffer: Array<T | PipeControl> = [];

    constructor(results: Array<T | PipeControl> = []) {
        if (Array.isArray(results)) {
            this.#buffer = results;
        } else if (typeof results[Symbol.iterator] === 'function') {
            for (const element of results as Iterable<T>) {
                this.#buffer.push(element);
            }
        }
    }

    get(index: number): T | PipeControl {
        return this.#buffer[index];
    }

    set(index: number, value: T | PipeControl): void {
        this.#buffer[index] = value;
    }

    push(value: T | PipeControl): void {
        if (value instanceof PipeResults) {
            for (const element of value as Iterable<T>) {
                this.#buffer.push(element);
            }
            return;
        }
        this.#buffer.push(value);
    }

    singleOrDefault(): T | PipeResult<T> {
        return this.#buffer.length === 1 ? this.#buffer[0] : this;
    }

    *[Symbol.iterator](): Generator<T | PipeControl> {
        yield* this.#buffer;
    }
}



export type PipeResult<T = unknown> =
    | T
    | PipeControl
    | PipeResults<T>;

/** A single stage in the pipeline */
export type Pipe<In = unknown, Out = unknown> = (
    value: PipeArgument<In>
) => PipeResult<Out>;

/**
 * An operator transforms a downstream pipe into an upstream pipe.
 *
 * - `In`  = what this operator accepts from the previous stage
 * - `Out` = what this operator produces for the next stage
 */
export type Operator<In = unknown, Out = unknown> = <NextOut = unknown>(
    next: Pipe<Out, NextOut>
) => Pipe<In, NextOut>;

export class ErrorControl extends CONTINUE {
    #error: Error | any;

    constructor(err: Error | any) {
        super();
        this.#error = err;
    }

    public get error(): Error | any {
        return this.#error;
    }

}

/** Starts the pipeline (error boundary) */
export function start<T>(next: Pipe<T, any>): (element: T) => PipeResult {
    return (element: T): PipeResult => {
        try {
            return next(element);
        } catch (error) {
            return next(new ErrorControl(error));
        }
    };
}

/** Terminal pipe – just forwards whatever it receives */
export function terminal<T>(item: PipeResult<T>): PipeResult<T> {
    return item;
}

export function done<In = unknown, Out = unknown>(next: Pipe<In, Out>, item: PipeArgument<In>): PipeResult<Out> {
    let results = new PipeResults<Out>();
    results.push(next(item));
    results.push(next(DONE));
    return results.singleOrDefault();
}

export function forward<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: Iterable<PipeArgument<In>>): PipeResult<Out> {
    let results = new PipeResults<Out>();
    for (const item of items) {
        results.push(next(item));
    }
    return results.singleOrDefault();
}

export function forwardAnd<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: Iterable<PipeArgument<In>>, last: PipeArgument<In>): PipeResult<Out> {
    let results = new PipeResults<Out>();
    for (const item of items) {
        results.push(next(item));
    }
    results.push(next(last));
    return results.singleOrDefault();
}

export async function forwardAsync<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: AsyncIterable<PipeArgument<In>>): Promise<PipeResult<Out>> {
    let results = new PipeResults<Out>();
    for await (const item of items) {
        results.push(next(item));
    }
    return results.singleOrDefault();
}

export async function forwardAndAsync<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: AsyncIterable<PipeArgument<In>>, last: PipeArgument<In>): Promise<PipeResult<Out>> {
    let results = new PipeResults<Out>();
    for await (const item of items) {
        results.push(next(item));
    }
    results.push(next(last));
    return results.singleOrDefault();
}