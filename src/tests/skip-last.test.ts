import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { skipLast } from "../pipes/skip-last.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync skipLast – skips the designated number of elements from the end', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        skipLast(2)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync skipLast – yields nothing if skip count matches stream length', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        skipLast(3)
    )];
    expect(result).toEqual([]);
});

test('sync skipLast – yields nothing if skip count exceeds stream length', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        skipLast(10)
    )];
    expect(result).toEqual([]);
});

test('sync skipLast – falls back to 0 skipping if count is 0', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        skipLast(0)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync skipLast – falls back to 0 skipping if count is negative', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        skipLast(-5)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync skipLast – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        skipLast(2)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async skipLast – skips trailing items from an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 15), // yields 10, 11, 12, 13, 14
            skipLast(3)
        )
    );
    expect(result).toEqual([10, 11]);
});

test('async skipLast – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            skipLast(1)
        )
    );
    expect(result).toEqual([]);
});
