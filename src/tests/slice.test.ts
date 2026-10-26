import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { slice } from "../pipes/slice.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync slice – extracts a window from start index to end index', () => {
    const result = [...pipeSync(
        sequenceSync(10, 16), // yields 10, 11, 12, 13, 14, 15
        slice(1, 4)
    )];
    expect(result).toEqual([11, 12, 13]);
});

test('sync slice – slices until the end if end parameter is omitted', () => {
    const result = [...pipeSync(
        sequenceSync(10, 15), // yields 10, 11, 12, 13, 14
        slice(2)
    )];
    expect(result).toEqual([12, 13, 14]);
});

test('sync slice – defaults to start index 0 if negative or invalid start is provided', () => {
    const result = [...pipeSync(
        sequenceSync(5, 9), // yields 5, 6, 7, 8
        slice(-3, 2)
    )];
    expect(result).toEqual([5, 6]);
});

test('sync slice – returns empty array if start matches or exceeds stream length', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        slice(5)
    )];
    expect(result).toEqual([]);
});

test('sync slice – returns empty array if end is less than or equal to start', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6),
        slice(3, 2)
    )];
    expect(result).toEqual([4, 5]);
});

test('sync slice – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        slice(0, 5)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async slice – windows items from an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(20, 26), // yields 20, 21, 22, 23, 24, 25
            slice(2, 5)
        )
    );
    expect(result).toEqual([22, 23, 24]);
});

test('async slice – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            slice(1, 3)
        )
    );
    expect(result).toEqual([]);
});
