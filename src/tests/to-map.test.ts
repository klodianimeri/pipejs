import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toMap } from '../pipes/to-map.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync toMap – builds Map from keys', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ],
        toMap(x => x.id)
    )];
    expect(result.length).toBe(1);
    expect(result[0].get(1)).toEqual({ id: 1, name: 'a' });
    expect(result[0].get(2)).toEqual({ id: 2, name: 'b' });
});

test('sync toMap – with valueSelector', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ],
        toMap(x => x.id, x => x.name)
    )];
    expect(result[0].get(1)).toBe('a');
    expect(result[0].get(2)).toBe('b');
});

test('sync toMap – duplicate key overwrites', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: 'first' },
            { id: 1, name: 'second' },
        ],
        toMap(x => x.id, x => x.name)
    )];
    expect(result[0].size).toBe(1);
    expect(result[0].get(1)).toBe('second');
});

test('sync toMap – empty source → empty Map', () => {
    const result = [...pipeSync(
        [] as number[],
        toMap((x: number) => x)
    )];
    expect(result.length).toBe(1);
    expect(result[0].size).toBe(0);
});

test('sync toMap – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        toMap(x => x, x => x + 1)
    )];
    expect(result[0].get(0)).toBe(1);
    expect(result[0].get(10)).toBe(11);
    expect(result[0].get(20)).toBe(21);
});

test('sync toMap – emits only one Map', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        toMap(x => x)
    )];
    expect(result.length).toBe(1);
    expect(result[0] instanceof Map).toBe(true);
});

// ---------- Async ----------

test('async toMap – builds Map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            toMap(x => x, x => x * 10)
        )
    );
    expect(result.length).toBe(1);
    expect(result[0].get(0)).toBe(0);
    expect(result[0].get(1)).toBe(10);
    expect(result[0].get(2)).toBe(20);
    expect(result[0].get(3)).toBe(30);
});

test('async toMap – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            toMap((x: number) => x)
        )
    );
    expect(result.length).toBe(1);
    expect(result[0].size).toBe(0);
});