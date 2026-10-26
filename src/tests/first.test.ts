import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { first } from '../pipes/first.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync first – takes first element', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        first()
    )];
    expect(result).toEqual([1]);
});

test('sync first – single element', () => {
    const result = [...pipeSync(
        [42],
        first()
    )];
    expect(result).toEqual([42]);
});

test('sync first – empty source → empty', () => {
    const result = [...pipeSync(
        [],
        first()
    )];
    expect(result).toEqual([]);
});

test('sync first – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        first()
    )];
    expect(result).toEqual([0]);
});

test('sync first – emits only one value', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        first()
    )];
    expect(result).toEqual([0]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async first – takes first element', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            first()
        )
    );
    expect(result).toEqual([0]);
});

test('async first – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            first()
        )
    );
    expect(result).toEqual([]);
});