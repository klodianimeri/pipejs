import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { concatMap, concatMapAsync } from '../pipes/concat-map.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

// ---------- Sync ----------

test('sync concatMap – flattens projected iterables in order', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        concatMap(x => [x, x * 10])
    )];
    expect(result).toEqual([1, 10, 2, 20, 3, 30]);
});

test('sync concatMap – empty inners are skipped', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        concatMap(x => (x === 2 ? [] : [x]))
    )];
    expect(result).toEqual([1, 3]);
});

test('sync concatMap – empty source', () => {
    const result = [...pipeSync(
        [] as number[],
        concatMap(x => [x])
    )];
    expect(result).toEqual([]);
});

test('sync concatMap – index passed to project', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b"],
        concatMap((x, i) => {
            indexes.push(i);
            return [x, String(i)];
        })
    )];
    expect(result).toEqual(["a", "0", "b", "1"]);
    expect(indexes).toEqual([0, 1]);
});

test('sync concatMap – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => x + 1),
        concatMap(x => [x, x * 2])
    )];
    expect(result).toEqual([1, 2, 2, 4, 3, 6]);
});

// ---------- Async ----------

test('async concatMap – sync inners', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            concatMap(x => [x, x + 10])
        )
    );
    expect(result).toEqual([0, 10, 1, 11, 2, 12]);
});

test('async concatMap – async inners preserve order', async () => {
    const order: number[] = [];
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            concatMapAsync(x => ({
                async *[Symbol.asyncIterator]() {
                    order.push(x);
                    await delay(30 - x * 10); // later items finish faster
                    yield x;
                    yield x * 10;
                },
            }))
        )
    );
    // concat: still source order, not completion order
    expect(order).toEqual([0, 1, 2]);
    expect(result).toEqual([0, 0, 1, 10, 2, 20]);
});

test('async concatMap – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            concatMap(x => [x])
        )
    );
    expect(result).toEqual([]);
});

test('async concatMap – empty async inner', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            concatMapAsync(x => ({
                async *[Symbol.asyncIterator]() {
                    if (x === 1) return;
                    yield x;
                },
            }))
        )
    );
    expect(result).toEqual([0, 2]);
});