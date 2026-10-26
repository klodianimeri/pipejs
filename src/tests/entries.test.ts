import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { entries } from '../pipes/entries.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync entries – pairs index with value', () => {
    const result = [...pipeSync(
        ["a", "b", "c"],
        entries()
    )];
    expect(result).toEqual([
        [0, "a"],
        [1, "b"],
        [2, "c"],
    ]);
});

test('sync entries – numbers', () => {
    const result = [...pipeSync(
        sequenceSync(10, 13),             // 10,11,12
        entries()
    )];
    expect(result).toEqual([
        [0, 10],
        [1, 11],
        [2, 12],
    ]);
});

test('sync entries – empty source', () => {
    const result = [...pipeSync(
        [],
        entries()
    )];
    expect(result).toEqual([]);
});

test('sync entries – single value', () => {
    const result = [...pipeSync(
        [42],
        entries()
    )];
    expect(result).toEqual([[0, 42]]);
});

test('sync entries – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        entries(),
        map(([i, v]) => `${i}:${v}`)
    )];
    expect(result).toEqual(["0:0", "1:1", "2:2"]);
});

test('sync entries – index is zero-based and contiguous', () => {
    const result = [...pipeSync(
        [5, 5, 5],
        entries()
    )];
    expect(result.map(([i]) => i)).toEqual([0, 1, 2]);
});

// ---------- Async ----------

test('async entries – pairs index with value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 13),
            entries()
        )
    );
    expect(result).toEqual([
        [0, 10],
        [1, 11],
        [2, 12],
    ]);
});

test('async entries – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            entries()
        )
    );
    expect(result).toEqual([]);
});

test('async entries – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            entries(),
            map(([i, v]) => i + v)
        )
    );
    expect(result).toEqual([0, 2, 4]); // 0+0, 1+1, 2+2
});