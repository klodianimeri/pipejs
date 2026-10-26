import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { takeLast } from "../pipes/take-last.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync takeLast – takes the designated number of elements from the end', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        takeLast(3)
    )];
    expect(result).toEqual([3, 4, 5]);
});

test('sync takeLast – returns all elements if count exceeds stream length', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        takeLast(10)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync takeLast – returns empty array if count is 0', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        takeLast(0)
    )];
    expect(result).toEqual([]);
});

test('sync takeLast – falls back to 0 if count is negative', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        takeLast(-5)
    )];
    expect(result).toEqual([]);
});

test('sync takeLast – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        takeLast(2)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async takeLast – takes trailing items from an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 15), // yields 10, 11, 12, 13, 14
            takeLast(2)
        )
    );
    expect(result).toEqual([13, 14]);
});

test('async takeLast – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            takeLast(1)
        )
    );
    expect(result).toEqual([]);
});
