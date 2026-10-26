import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { filter } from '../pipes/filter.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync filter – keeps matching values', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5, 6],
        filter(x => x % 2 === 0)
    )];
    expect(result).toEqual([2, 4, 6]);
});

test('sync filter – none match', () => {
    const result = [...pipeSync(
        [1, 3, 5],
        filter(x => x % 2 === 0)
    )];
    expect(result).toEqual([]);
});

test('sync filter – all match', () => {
    const result = [...pipeSync(
        [2, 4, 6],
        filter(x => x % 2 === 0)
    )];
    expect(result).toEqual([2, 4, 6]);
});

test('sync filter – empty source', () => {
    const result = [...pipeSync(
        [],
        filter(() => true)
    )];
    expect(result).toEqual([]);
});

test('sync filter – index is passed', () => {
    const result = [...pipeSync(
        ["a", "b", "c", "d"],
        filter((_, i) => i % 2 === 0)
    )];
    expect(result).toEqual(["a", "c"]);
});

test('sync filter – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),
        filter(x => x > 2),
        map(x => x * 10)
    )];
    expect(result).toEqual([30, 40, 50]);
});

test('sync filter – map then filter', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 2),
        filter(x => x >= 4)
    )];
    expect(result).toEqual([4, 6, 8]);
});

// ---------- Async ----------

test('async filter – keeps matching values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            filter(x => x % 2 === 1)
        )
    );
    expect(result).toEqual([1, 3, 5]);
});

test('async filter – none match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            filter(x => x > 100)
        )
    );
    expect(result).toEqual([]);
});

test('async filter – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            filter(() => true)
        )
    );
    expect(result).toEqual([]);
});

test('async filter – index is passed', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14),
            filter((_, i) => i < 2)
        )
    );
    expect(result).toEqual([10, 11]);
});

test('async filter – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            filter(x => x % 2 === 0),
            map(x => x * 10)
        )
    );
    expect(result).toEqual([0, 20, 40]);
});