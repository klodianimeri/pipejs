import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { retry } from '../pipes/retry.js';
import { map } from '../pipes/map.js';
import { catchError } from '../pipes/catch-error.js';
import { ErrorControl } from "../pipe.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import type { Operator, Pipe, PipeArgument, PipeResult } from "../pipe.js";
import { CONTINUE, DONE } from "../pipe.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

/** Emits ErrorControl for values matching `pred` (flows through `next`). */
function failWhen<T>(pred: (value: T) => boolean): Operator<T, T> {
    return <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        return (element: PipeArgument<T>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (pred(element as T)) {
                return next(new ErrorControl(new Error("boom")) as any);
            }
            return next(element as any);
        };
    };
}

// ---------- Sync ----------

test('sync retry – swallows errors up to count', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        failWhen(x => x === 2 || x === 3),
        retry(2)
    )];
    expect(result).toEqual([1, 4]);
});

test('sync retry – exceeds count → throws', () => {
    expect(() => [...pipeSync(
        [1, 2, 3],
        failWhen(x => x === 2 || x === 3),
        retry(1)
    )]).toThrow("boom");
});

test('sync retry – count 0 does not swallow', () => {
    expect(() => [...pipeSync(
        [1, 2, 3],
        failWhen(x => x === 2),
        retry(0)
    )]).toThrow("boom");
});

test('sync retry – no errors → passthrough', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        retry(3)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync retry – works with catchError after exhaustion', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        failWhen(x => x === 2),
        retry(0),
        catchError(() => -1)
    )];
    expect(result).toEqual([1, -1, 3]);
});

test('sync retry – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        map(x => x * 10),
        failWhen(x => x === 20),
        retry(1)
    )];
    expect(result).toEqual([0, 10, 30]);
});

// ---------- Async ----------

test('async retry – swallows errors up to count', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            failWhen(x => x === 2 || x === 3),
            retry(2)
        )
    );
    expect(result).toEqual([0, 1, 4]);
});

test('async retry – exceeds count → throws', async () => {
    await expect(collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            failWhen(x => x === 1 || x === 2),
            retry(1)
        )
    )).rejects.toThrow("boom");
});

test('async retry – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            retry(3)
        )
    );
    expect(result).toEqual([]);
});