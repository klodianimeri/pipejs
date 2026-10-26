import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { take } from '../pipes/take.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync take – first n elements', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        take(3)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync take – count larger than source', () => {
    const result = [...pipeSync(
        [1, 2],
        take(10)
    )];
    expect(result).toEqual([1, 2]);
});

test('sync take – count 0 → empty', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        take(0)
    )];
    expect(result).toEqual([]);
});

test('sync take – negative count → empty', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        take(-5)
    )];
    expect(result).toEqual([]);
});

test('sync take – empty source', () => {
    const result = [...pipeSync(
        [],
        take(3)
    )];
    expect(result).toEqual([]);
});

test('sync take – take 1', () => {
    const result = [...pipeSync(
        [10, 20, 30],
        take(1)
    )];
    expect(result).toEqual([10]);
});

test('sync take – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        take(3)
    )];
    expect(result).toEqual([0, 10, 20]);
});

// ---------- Async ----------

test('async take – first n elements', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            take(3)
        )
    );
    expect(result).toEqual([0, 1, 2]);
});

test('async take – count 0 → empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            take(0)
        )
    );
    expect(result).toEqual([]);
});

test('async take – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            take(3)
        )
    );
    expect(result).toEqual([]);
});