import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { flat } from '../pipes/flat.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync flat – depth 1 (default)', () => {
    const result = [...pipeSync(
        [[1, 2], [3, 4], 5],
        flat()
    )];
    expect(result).toEqual([1, 2, 3, 4, 5]);
});

test('sync flat – depth 2', () => {
    const result = [...pipeSync(
        [[[1, 2], [3]], [[4]], 5],
        flat(2)
    )];
    expect(result).toEqual([1, 2, 3, 4, 5]);
});

test('sync flat – non-iterables pass through', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        flat()
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync flat – empty inner arrays', () => {
    const result = [...pipeSync(
        [[], [1], [], [2, 3]],
        flat()
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync flat – empty source', () => {
    const result = [...pipeSync(
        [],
        flat()
    )];
    expect(result).toEqual([]);
});

test('sync flat – depth < 1 falls back to 1', () => {
    const result = [...pipeSync(
        [[1, 2], [3]],
        flat(0)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync flat – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => [x, x + 10]),
        flat()
    )];
    expect(result).toEqual([0, 10, 1, 11, 2, 12]);
});

// ---------- Async ----------

test('async flat – depth 1', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield [1, 2];
                yield [3];
                yield 4;
            })(),
            flat()
        )
    );
    expect(result).toEqual([1, 2, 3, 4]);
});

test('async flat – depth 2', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield [[1], [2, 3]];
                yield [[4]];
            })(),
            flat(2)
        )
    );
    expect(result).toEqual([1, 2, 3, 4]);
});

test('async flat – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            flat()
        )
    );
    expect(result).toEqual([]);
});