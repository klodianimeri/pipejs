import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { ignoreElements } from '../pipes/ignore-elements.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync ignoreElements – drops all values', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        ignoreElements()
    )];
    expect(result).toEqual([]);
});

test('sync ignoreElements – empty source', () => {
    const result = [...pipeSync(
        [],
        ignoreElements()
    )];
    expect(result).toEqual([]);
});

test('sync ignoreElements – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        ignoreElements()
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async ignoreElements – drops all values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            ignoreElements()
        )
    );
    expect(result).toEqual([]);
});

test('async ignoreElements – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            ignoreElements()
        )
    );
    expect(result).toEqual([]);
});