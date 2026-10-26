import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toSet } from "../pipes/to-set.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync toSet – accumulates unique elements into a single Set instance', () => {
    // We pass duplicate items by using a raw array instead of sequenceSync
    const duplicateArray = [1, 2, 3, 4, 1, 4];
    const result = [...pipeSync(duplicateArray, toSet())];

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Set);
    expect(result[0]).toEqual(new Set([1, 2, 3, 4]));
});

test('sync toSet – returns an empty Set if the source stream is empty', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        toSet()
    )];

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Set);
    expect(result[0]).toEqual(new Set());
});

// ---------- Async ----------

test('async toSet – accumulates elements into a Set instance from an async stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 13), // yields 10, 11, 12
            toSet()
        )
    );

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Set);
    expect(result[0]).toEqual(new Set([10, 11, 12]));
});

test('async toSet – returns an empty Set for empty async sources', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            toSet()
        )
    );

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Set);
    expect(result[0]).toEqual(new Set());
});
