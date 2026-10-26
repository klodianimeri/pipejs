import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { findLast } from '../pipes/find-last.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync findLast – finds last match', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        findLast(x => x % 2 === 0)
    )];
    expect(result).toEqual([4]);
});

test('sync findLast – only match at start', () => {
    const result = [...pipeSync(
        [2, 3, 5],
        findLast(x => x % 2 === 0)
    )];
    expect(result).toEqual([2]);
});

test('sync findLast – no match → empty', () => {
    const result = [...pipeSync(
        [1, 3, 5],
        findLast(x => x % 2 === 0)
    )];
    expect(result).toEqual([]);
});

test('sync findLast – empty source → empty', () => {
    const result = [...pipeSync(
        [],
        findLast(() => true)
    )];
    expect(result).toEqual([]);
});

test('sync findLast – index passed to predicate', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b", "c"],
        findLast((_, i) => {
            indexes.push(i);
            return i >= 1;
        })
    )];
    expect(result).toEqual(["c"]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('sync findLast – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        findLast(x => x === 30 || x === 40)
    )];
    expect(result).toEqual([40]);
});

test('sync findLast – emits only one value', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        findLast(x => x === 0)
    )];
    expect(result).toEqual([0]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async findLast – finds last match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            findLast(x => x % 2 === 0)
        )
    );
    expect(result).toEqual([4]);
});

test('async findLast – no match → empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            findLast(x => x > 100)
        )
    );
    expect(result).toEqual([]);
});

test('async findLast – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            findLast(() => true)
        )
    );
    expect(result).toEqual([]);
});