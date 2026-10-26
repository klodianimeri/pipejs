import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { single } from '../pipes/single.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync single – exactly one element', () => {
    const result = [...pipeSync(
        [42],
        single()
    )];
    expect(result).toEqual([42]);
});

test('sync single – empty sequence throws', () => {
    expect(() => [...pipeSync([], single())]).toThrow(/empty/);
});

test('sync single – more than one element throws', () => {
    expect(() => [...pipeSync([1, 2], single())]).toThrow(/more than one/);
});

test('sync single – with predicate, one match', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        single(x => x === 3)
    )];
    expect(result).toEqual([3]);
});

test('sync single – with predicate, no match throws', () => {
    expect(() => [
        ...pipeSync([1, 2, 3], single(x => x > 10))
    ]).toThrow(/empty/);
});

test('sync single – with predicate, multiple matches throws', () => {
    expect(() => [
        ...pipeSync([1, 2, 3, 4], single(x => x % 2 === 0))
    ]).toThrow(/more than one/);
});

test('sync single – index is passed to predicate', () => {
    const result = [...pipeSync(
        [10, 20, 30],
        single((_, i) => i === 1)
    )];
    expect(result).toEqual([20]);
});

test('sync single – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(5, 6),               // [5]
        single(),
        map(x => x * 10)
    )];
    expect(result).toEqual([50]);
});

// ---------- Async ----------

test('async single – exactly one element', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(7, 8), single())
    );
    expect(result).toEqual([7]);
});

test('async single – empty throws', async () => {
    await expect(
        collectAsync(pipeAsync(sequenceAsync(0, 0), single()))
    ).rejects.toThrow(/empty/);
});

test('async single – multiple throws', async () => {
    await expect(
        collectAsync(pipeAsync(sequenceAsync(0, 3), single()))
    ).rejects.toThrow(/more than one/);
});

test('async single – predicate one match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            single(x => x === 3)
        )
    );
    expect(result).toEqual([3]);
});