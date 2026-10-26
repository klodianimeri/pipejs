import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { repeat } from "../pipes/repeat.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync repeat – repeats stream multiple times based on count', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        repeat(3)
    )];
    // Emits original stream (1, 2, 3) followed by 2 repetitions
    expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
});

test('sync repeat – defaults to repeating exactly 1 total time if count is omitted', () => {
    const result = [...pipeSync(
        sequenceSync(5, 7), // yields 5, 6
        repeat()
    )];
    expect(result).toEqual([5, 6]);
});

test('sync repeat – defaults to 1 repetition if count is negative or zero', () => {
    const result = [...pipeSync(
        sequenceSync(10, 12), // yields 10, 11
        repeat(-5)
    )];
    expect(result).toEqual([10, 11]);
});

test('sync repeat – empty source yields nothing regardless of repeat count', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        repeat(5)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async repeat – repeats async sequence streams successfully', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 3), // yields 1, 2
            repeat(2)
        )
    );
    expect(result).toEqual([1, 2, 1, 2]);
});

test('async repeat – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            repeat(3)
        )
    );
    expect(result).toEqual([]);
});
