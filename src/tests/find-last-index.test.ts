import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { findLastIndex } from '../pipes/find-last-index.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync findLastIndex – finds last match', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        findLastIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([3]);
});

test('sync findLastIndex – match at index 0 only', () => {
    const result = [...pipeSync(
        [2, 3, 5],
        findLastIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([0]);
});

test('sync findLastIndex – no match → -1', () => {
    const result = [...pipeSync(
        [1, 3, 5],
        findLastIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([-1]);
});

test('sync findLastIndex – empty source → -1', () => {
    const result = [...pipeSync(
        [],
        findLastIndex(() => true)
    )];
    expect(result).toEqual([-1]);
});

test('sync findLastIndex – fromIndex skips earlier matches', () => {
    const result = [...pipeSync(
        [2, 4, 5, 6, 8],
        findLastIndex(x => x % 2 === 0, 2)
    )];
    // indices 0,1 skipped; last even after is 8 at 4
    expect(result).toEqual([4]);
});

test('sync findLastIndex – fromIndex past all → -1', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        findLastIndex(x => true, 10)
    )];
    expect(result).toEqual([-1]);
});

test('sync findLastIndex – index passed to predicate', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b", "c"],
        findLastIndex((_, i) => {
            indexes.push(i);
            return i >= 1;
        })
    )];
    expect(result).toEqual([2]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('sync findLastIndex – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        findLastIndex(x => x === 30 || x === 40)
    )];
    expect(result).toEqual([4]);
});

test('sync findLastIndex – emits only one number', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        findLastIndex(x => x === 0)
    )];
    expect(result).toEqual([2]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async findLastIndex – finds last match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            findLastIndex(x => x % 2 === 0)
        )
    );
    expect(result).toEqual([4]);
});

test('async findLastIndex – no match → -1', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            findLastIndex(x => x > 100)
        )
    );
    expect(result).toEqual([-1]);
});

test('async findLastIndex – fromIndex', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            findLastIndex(x => x % 2 === 0, 3)
        )
    );
    // 0,2 skipped; last even is 4
    expect(result).toEqual([4]);
});

test('async findLastIndex – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            findLastIndex(() => true)
        )
    );
    expect(result).toEqual([-1]);
});