import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { groupBy } from '../pipes/group-by.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync groupBy – groups by key', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5, 6],
        groupBy(x => x % 2 === 0 ? 'even' : 'odd')
    )];
    expect(result.length).toBe(1);
    expect(result[0].get('odd')).toEqual([1, 3, 5]);
    expect(result[0].get('even')).toEqual([2, 4, 6]);
});

test('sync groupBy – with elementSelector', () => {
    const result = [...pipeSync(
        [
            { type: 'a', n: 1 },
            { type: 'b', n: 2 },
            { type: 'a', n: 3 },
        ],
        groupBy(x => x.type, x => x.n)
    )];
    expect(result.length).toBe(1);
    expect(result[0].get('a')).toEqual([1, 3]);
    expect(result[0].get('b')).toEqual([2]);
});

test('sync groupBy – empty source → empty Map', () => {
    const result = [...pipeSync(
        [],
        groupBy((x: number) => x)
    )];
    expect(result.length).toBe(1);
    expect(result[0].size).toBe(0);
});

test('sync groupBy – single group', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        groupBy(() => 'all')
    )];
    expect(result[0].get('all')).toEqual([1, 2, 3]);
});

test('sync groupBy – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        map(x => x * 10),
        groupBy(x => x < 20 ? 'low' : 'high')
    )];
    expect(result[0].get('low')).toEqual([0, 10]);
    expect(result[0].get('high')).toEqual([20, 30]);
});

test('sync groupBy – emits only one Map', () => {
    const result = [...pipeSync(
        [1, 1, 1],
        groupBy(x => x)
    )];
    expect(result.length).toBe(1);
    expect(result[0] instanceof Map).toBe(true);
});

// ---------- Async ----------

test('async groupBy – groups by key', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            groupBy(x => x % 2 === 0 ? 'even' : 'odd')
        )
    );
    expect(result.length).toBe(1);
    expect(result[0].get('even')).toEqual([0, 2, 4]);
    expect(result[0].get('odd')).toEqual([1, 3, 5]);
});

test('async groupBy – with elementSelector', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            groupBy(x => x % 2, x => x * 10)
        )
    );
    expect(result[0].get(0)).toEqual([0, 20]);
    expect(result[0].get(1)).toEqual([10, 30]);
});

test('async groupBy – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            groupBy((x: number) => x)
        )
    );
    expect(result.length).toBe(1);
    expect(result[0].size).toBe(0);
});