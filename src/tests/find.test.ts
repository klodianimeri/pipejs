import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { find } from '../pipes/find.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync find – finds first match', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        find(x => x % 2 === 0)
    )];
    expect(result).toEqual([2]);
});

test('sync find – match at index 0', () => {
    const result = [...pipeSync(
        [2, 3, 5],
        find(x => x % 2 === 0)
    )];
    expect(result).toEqual([2]);
});

test('sync find – no match → empty', () => {
    const result = [...pipeSync(
        [1, 3, 5],
        find(x => x % 2 === 0)
    )];
    expect(result).toEqual([]);
});

test('sync find – empty source → empty', () => {
    const result = [...pipeSync(
        [],
        find(() => true)
    )];
    expect(result).toEqual([]);
});

test('sync find – index passed to predicate', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b", "c"],
        find((_, i) => {
            indexes.push(i);
            return i === 2;
        })
    )];
    expect(result).toEqual(["c"]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('sync find – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        find(x => x === 30)
    )];
    expect(result).toEqual([30]);
});

test('sync find – emits only one value', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        find(x => x === 0)
    )];
    expect(result).toEqual([0]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async find – finds first match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            find(x => x === 4)
        )
    );
    expect(result).toEqual([4]);
});

test('async find – no match → empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            find(x => x > 100)
        )
    );
    expect(result).toEqual([]);
});

test('async find – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            find(() => true)
        )
    );
    expect(result).toEqual([]);
});