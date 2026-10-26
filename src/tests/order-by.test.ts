import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { orderBy } from '../pipes/order-by.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync orderBy – ascending by value', () => {
    const result = [...pipeSync(
        [3, 1, 4, 1, 5, 9, 2],
        orderBy(x => x)
    )];
    expect(result).toEqual([1, 1, 2, 3, 4, 5, 9]);
});

test('sync orderBy – by property', () => {
    const result = [...pipeSync(
        [
            { name: 'c', n: 3 },
            { name: 'a', n: 1 },
            { name: 'b', n: 2 },
        ],
        orderBy(x => x.name)
    )];
    expect(result.map(x => x.name)).toEqual(['a', 'b', 'c']);
});

test('sync orderBy – custom comparer (descending)', () => {
    const result = [...pipeSync(
        [3, 1, 4, 1, 5],
        orderBy(x => x, (a, b) => b - a)
    )];
    expect(result).toEqual([5, 4, 3, 1, 1]);
});

test('sync orderBy – empty source', () => {
    const result = [...pipeSync(
        [] as number[],
        orderBy(x => x)
    )];
    expect(result).toEqual([]);
});

test('sync orderBy – single element', () => {
    const result = [...pipeSync(
        [42],
        orderBy(x => x)
    )];
    expect(result).toEqual([42]);
});

test('sync orderBy – already sorted', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        orderBy(x => x)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync orderBy – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => (5 - x) * 10),
        orderBy(x => x)
    )];
    expect(result).toEqual([10, 20, 30, 40, 50]);
});

test('sync orderBy – stable for equal keys', () => {
    const result = [...pipeSync(
        [
            { k: 1, id: 'a' },
            { k: 2, id: 'b' },
            { k: 1, id: 'c' },
        ],
        orderBy(x => x.k)
    )];
    expect(result.map(x => x.id)).toEqual(['a', 'c', 'b']);
});

// ---------- Async ----------

test('async orderBy – ascending by value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            map(x => 4 - x),
            orderBy(x => x)
        )
    );
    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async orderBy – custom comparer', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            orderBy(x => x, (a, b) => b - a)
        )
    );
    expect(result).toEqual([3, 2, 1, 0]);
});

test('async orderBy – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            orderBy((x: number) => x)
        )
    );
    expect(result).toEqual([]);
});