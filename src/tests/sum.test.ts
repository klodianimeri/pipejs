import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sum } from "../pipes/sum.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync sum – accumulates standard numbers correctly', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        sum()
    )];
    expect(result).toEqual([10]);
});

test('sync sum – returns 0 for an entirely empty stream', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0), // empty
        sum()
    )];
    expect(result).toEqual([0]);
});

test('sync sum – edge case: skips NaN values gracefully without corrupting total', () => {
    // We can simulate passing NaN by feeding a custom array via pipeSync
    // (Note: since sequenceSync only yields numbers, we pass mixed array elements)
    const mixedSource: any[] = [5, NaN, 15, "invalid-type", 20];
    const result = [...pipeSync(
        mixedSource,
        sum()
    )];
    expect(result).toEqual([40]);
});

test('sync sum – handles negative numbers correctly', () => {
    const mixedSource = [10, -3, 5, -2];
    const result = [...pipeSync(
        mixedSource,
        sum()
    )];
    expect(result).toEqual([10]);
});

// ---------- Async ----------

test('async sum – accumulates values from an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            sum()
        )
    );
    expect(result).toEqual([46]);
});

test('async sum – returns 0 for an empty async source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            sum()
        )
    );
    expect(result).toEqual([0]);
});
