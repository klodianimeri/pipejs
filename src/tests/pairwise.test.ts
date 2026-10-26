import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { pairwise } from "../pipes/pairwise.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync pairwise – yields consecutive pairs from a multi-item source', () => {
    const result = [...pipeSync(sequenceSync(1, 5), pairwise())];
    // Emits overlapping consecutive pairs
    expect(result).toEqual([[1, 2], [2, 3], [3, 4]]);
});

test('sync pairwise – source with fewer than 2 elements yields nothing', () => {
    const result = [...pipeSync(sequenceSync(0, 1), pairwise())];
    expect(result).toEqual([]);
});

test('sync pairwise – empty source yields nothing', () => {
    const result = [...pipeSync(sequenceSync(0, 0), pairwise())];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async pairwise – emits pairs for an async sequence source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            pairwise()
        )
    );
    expect(result).toEqual([[10, 11], [11, 12], [12, 13]]);
});

test('async pairwise – empty async source yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            pairwise()
        )
    );
    expect(result).toEqual([]);
});
