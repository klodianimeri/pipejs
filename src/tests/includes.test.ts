import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { includes } from '../pipes/includes.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync includes – finds value', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        includes(3)
    )];
    expect(result).toEqual([true]);
});

test('sync includes – missing value → false', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        includes(99)
    )];
    expect(result).toEqual([false]);
});

test('sync includes – empty source → false', () => {
    const result = [...pipeSync(
        [],
        includes(1)
    )];
    expect(result).toEqual([false]);
});

test('sync includes – fromIndex skips earlier', () => {
    const result = [...pipeSync(
        [1, 2, 3, 2],
        includes(2, 2)
    )];
    // index 1 skipped; finds 2 at index 3
    expect(result).toEqual([true]);
});

test('sync includes – fromIndex past match → false', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        includes(2, 2)
    )];
    expect(result).toEqual([false]);
});

test('sync includes – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        includes(30)
    )];
    expect(result).toEqual([true]);
});

test('sync includes – emits only one boolean', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        includes(0)
    )];
    expect(result).toEqual([true]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async includes – finds value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            includes(4)
        )
    );
    expect(result).toEqual([true]);
});

test('async includes – missing → false', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            includes(100)
        )
    );
    expect(result).toEqual([false]);
});

test('async includes – fromIndex', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            includes(2, 3)
        )
    );
    expect(result).toEqual([false]);
});

test('async includes – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            includes(0)
        )
    );
    expect(result).toEqual([false]);
});