import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { min } from "../pipes/min.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync min – finds the smallest number in a mixed stream', () => {
    const sourceArray = [3, 10, -5, 42, 12];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([-5]);
});

test('sync min – handles entirely positive numbers', () => {
    const sourceArray = [3, 10, 5, 42, 12];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([3]);
});

test('sync min – empty source emits nothing', () => {
    const sourceArray: number[] = [];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([]);
});

test('sync min – edge case: skips NaN values gracefully', () => {
    const sourceArray = [10, NaN, 4, 25];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([4]);
});

test('sync min – edge case: skips invalid types masquerading as numbers', () => {
    const sourceArray = [15, "-100" as any, 12];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([12]);
});

test('sync min – edge case behavior: stream of only Infinity will remain empty', () => {
    // Due to minVal !== Infinity check at DONE, Infinity cannot be emitted
    const sourceArray = [Infinity, Infinity];
    const result = [...pipeSync(sourceArray, min())];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async min – finds minimum value from sequenceAsync stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(5, 10), // yields 5, 6, 7, 8, 9
            min()
        )
    );
    expect(result).toEqual([5]);
});

test('async min – empty async source emits nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            min()
        )
    );
    expect(result).toEqual([]);
});
