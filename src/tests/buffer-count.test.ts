import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { bufferCount } from '../pipes/buffer-count.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync – non-overlapping (default every = count) ----------

test('sync bufferCount – exact multiple', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5, 6],
        bufferCount(2)
    )];
    expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
});

test('sync bufferCount – remainder flushed on complete', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        bufferCount(2)
    )];
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
});

test('sync bufferCount – count 1', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        bufferCount(1)
    )];
    expect(result).toEqual([[1], [2], [3]]);
});

test('sync bufferCount – count larger than source', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        bufferCount(10)
    )];
    expect(result).toEqual([[1, 2, 3]]);
});

test('sync bufferCount – empty source', () => {
    const result = [...pipeSync(
        [],
        bufferCount(3)
    )];
    expect(result).toEqual([]);
});

// ---------- Sync – overlapping / step (every) ----------

test('sync bufferCount – every < count (overlap)', () => {
    // count=3, every=1 → [1,2,3], [2,3,4], [3,4,5], then remainder [4,5], [5]?
    // After emit [1,2,3], splice(0,1) → [2,3]; push 4 → [2,3,4]; emit; splice → [3,4]; ...

    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        bufferCount(3, 1)
    )];

    expect(result).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5], [5]]);
});

test('sync bufferCount – every = count (no overlap)', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),
        bufferCount(3, 3)
    )];
    expect(result).toEqual([[0, 1, 2], [3, 4, 5]]);
});

test('sync bufferCount – every > count (skip values)', () => {
    // count=2, every=3: [0,1] emit, splice 3 → drop 0,1 and the next push starts fresh
    const result = [...pipeSync(
        [0, 1, 2, 3, 4, 5],
        bufferCount(2, 3)
    )];
    // [0,1] → splice(0,3) on [0,1] → []; push 2,3 → [2,3] emit; splice → []; push 4,5 → [4,5]
    expect(result).toEqual([[0, 1], [2, 3], [4, 5]]);
});

// ---------- Composition ----------

test('sync bufferCount – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),
        bufferCount(2),
        map((chunk: number[]) => chunk.map(x => x * 10))
    )];
    expect(result).toEqual([[0, 10], [20, 30], [40, 50]]);
});

// ---------- Async ----------

test('async bufferCount – basic', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            bufferCount(2)
        )
    );
    expect(result).toEqual([[0, 1], [2, 3], [4]]);
});

test('async bufferCount – empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            bufferCount(3)
        )
    );
    expect(result).toEqual([]);
});

test('async bufferCount – overlap', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 6),            // 1..5
            bufferCount(3, 2)
        )
    );
    // [1,2,3] splice 2 → [3]; +4 → [3,4]; +5 → [3,4,5] emit; splice 2 → [5]; done → [5]
    expect(result).toEqual([[1, 2, 3], [3, 4, 5], [5]]);
});