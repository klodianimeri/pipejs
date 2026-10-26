import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toArray } from "../pipes/to-array.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync toArray – collects all individual stream elements into a single array', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        toArray()
    )];
    // Since pipeSync yields values from the pipeline, it returns a 2D-like array structure containing the single result array
    expect(result).toEqual([[1, 2, 3, 4]]);
});

test('sync toArray – returns an empty array if the source is entirely empty', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0), // empty source
        toArray()
    )];
    expect(result).toEqual([[]]);
});

test('sync toArray – safely captures single element streams', () => {
    const result = [...pipeSync(
        sequenceSync(42, 43), // yields 42
        toArray()
    )];
    expect(result).toEqual([[42]]);
});

// ---------- Async ----------

test('async toArray – collects all async sequence elements into a single array structure', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 13), // yields 10, 11, 12
            toArray()
        )
    );
    expect(result).toEqual([[10, 11, 12]]);
});

test('async toArray – returns empty array wrapper for empty async source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            toArray()
        )
    );
    expect(result).toEqual([[]]);
});
