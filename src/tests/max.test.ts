import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { max } from "../pipes/max.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync max – finds the largest number in a mixed stream', () => {
    const sourceArray = [3, 10, -5, 42, 12];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([42]);
});

test('sync max – handles entirely negative numbers', () => {
    const sourceArray = [-10, -3, -50, -5];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([-3]);
});

test('sync max – empty source emits nothing', () => {
    const sourceArray: number[] = [];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([]);
});

test('sync max – edge case: skips NaN values gracefully', () => {
    const sourceArray = [10, NaN, 25, 5];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([25]);
});

test('sync max – edge case: skips invalid types masquerading as numbers', () => {
    const sourceArray = [5, "100" as any, 12];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([12]);
});

test('sync max – edge case behavior: stream of only -Infinity will remain empty', () => {
    // Due to maxVal !== -Infinity check at DONE, -Infinity cannot be emitted
    const sourceArray = [-Infinity, -Infinity];
    const result = [...pipeSync(sourceArray, max())];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async max – finds maximum value from sequenceAsync stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(5, 10), // yields 5, 6, 7, 8, 9
            max()
        )
    );
    expect(result).toEqual([9]);
});

test('async max – empty async source emits nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            max()
        )
    );
    expect(result).toEqual([]);
});
