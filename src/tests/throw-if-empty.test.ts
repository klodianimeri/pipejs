import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { throwIfEmpty } from '../pipes/throw-if-empty.js';
import { map } from '../pipes/map.js';
import { filter } from '../pipes/filter.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync throwIfEmpty – passes non-empty through', () => {
    expect([...pipeSync(
        [1, 2, 3],
        throwIfEmpty()
    )]).toEqual([1, 2, 3]);
});

test('sync throwIfEmpty – empty source throws', () => {
    expect(() => [...pipeSync(
        [],
        throwIfEmpty()
    )]).toThrow(/empty/i);
});

test('sync throwIfEmpty – custom factory Error', () => {
    expect(() => [...pipeSync(
        [],
        throwIfEmpty(() => new Error("none"))
    )]).toThrow("none");
});

test('sync throwIfEmpty – custom factory string', () => {
    expect(() => [...pipeSync(
        [],
        throwIfEmpty(() => "no items")
    )]).toThrow("no items");
});

test('sync throwIfEmpty – filtered to empty throws', () => {
    expect(() => [...pipeSync(
        [1, 2, 3],
        filter(() => false),
        throwIfEmpty()
    )]).toThrow(/empty/i);
});

test('sync throwIfEmpty – works after map', () => {
    expect([...pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        throwIfEmpty()
    )]).toEqual([0, 10, 20]);
});

test('sync throwIfEmpty – single value ok', () => {
    expect([...pipeSync(
        [42],
        throwIfEmpty()
    )]).toEqual([42]);
});

// ---------- Async ----------

test('async throwIfEmpty – passes non-empty through', async () => {
    expect(await collectAsync(
        pipeAsync(sequenceAsync(0, 3), throwIfEmpty())
    )).toEqual([0, 1, 2]);
});

test('async throwIfEmpty – empty source throws', async () => {
    await expect(collectAsync(
        pipeAsync(sequenceAsync(0, 0), throwIfEmpty())
    )).rejects.toThrow(/empty/i);
});

test('async throwIfEmpty – custom factory', async () => {
    await expect(collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            throwIfEmpty(() => new Error("async empty"))
        )
    )).rejects.toThrow("async empty");
});