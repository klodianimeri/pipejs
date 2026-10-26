import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { findIndex } from '../pipes/find-index.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync findIndex – finds first match', () => {
    const result = [...pipeSync(
        [1, 3, 5, 6, 7],
        findIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([3]);
});

test('sync findIndex – match at index 0', () => {
    const result = [...pipeSync(
        [2, 3, 4],
        findIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([0]);
});

test('sync findIndex – no match → empty', () => {
    const result = [...pipeSync(
        [1, 3, 5],
        findIndex(x => x % 2 === 0)
    )];
    expect(result).toEqual([-1]);
});

test('sync findIndex – empty source → empty', () => {
    const result = [...pipeSync(
        [],
        findIndex(() => true)
    )];
    expect(result).toEqual([-1]);
});

test('sync findIndex – fromIndex skips earlier matches', () => {
    const result = [...pipeSync(
        [2, 4, 5, 6],
        findIndex(x => x % 2 === 0, 2)
    )];
    // index 0,1 skipped; next even is 6 at index 3
    expect(result).toEqual([3]);
});

test('sync findIndex – fromIndex past all values → empty', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        findIndex(x => true, 10)
    )];
    expect(result).toEqual([-1]);
});

test('sync findIndex – index is passed to predicate', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b", "c"],
        findIndex((_, i) => {
            indexes.push(i);
            return i === 2;
        })
    )];
    expect(result).toEqual([2]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('sync findIndex – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        findIndex(x => x === 30)
    )];
    expect(result).toEqual([3]);
});

test('sync findIndex – emits only one number', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        findIndex(x => x === 0)
    )];
    expect(result).toEqual([0]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async findIndex – finds first match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            findIndex(x => x === 4)
        )
    );
    expect(result).toEqual([4]);
});

test('async findIndex – no match → empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            findIndex(x => x > 100)
        )
    );
    expect(result).toEqual([-1]);
});

test('async findIndex – fromIndex', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            findIndex(x => x % 2 === 0, 3)
        )
    );
    // 0,2 skipped by fromIndex; next even is 4
    expect(result).toEqual([4]);
});

test('async findIndex – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            findIndex(() => true)
        )
    );
    expect(result).toEqual([-1]);
});