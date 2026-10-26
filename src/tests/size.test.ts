import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { size } from "../pipes/size.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync size – returns total count of elements for a multi-item stream', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        size()
    )];
    expect(result).toEqual([5]);
});

test('sync size – returns 1 for a single-item stream', () => {
    const result = [...pipeSync(
        sequenceSync(42, 43), // yields 42
        size()
    )];
    expect(result).toEqual([1]);
});

test('sync size – returns 0 for an empty stream', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        size()
    )];
    expect(result).toEqual([0]);
});

// ---------- Async ----------

test('async size – returns total count of elements for an async stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            size()
        )
    );
    expect(result).toEqual([4]);
});

test('async size – returns 0 for an empty async stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            size()
        )
    );
    expect(result).toEqual([0]);
});
