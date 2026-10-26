import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { defaultIfEmpty } from '../pipes/default-if-empty.js';
import { map, filter } from '../pipes/index.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync defaultIfEmpty – empty source emits default', () => {
    const result = [...pipeSync(
        [],
        defaultIfEmpty(42)
    )];
    expect(result).toEqual([42]);
});

test('sync defaultIfEmpty – non-empty source ignores default', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        defaultIfEmpty(42)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync defaultIfEmpty – single value', () => {
    const result = [...pipeSync(
        [7],
        defaultIfEmpty(0)
    )];
    expect(result).toEqual([7]);
});

test('sync defaultIfEmpty – default can be another type', () => {
    const result = [...pipeSync(
        [] as number[],
        defaultIfEmpty("none")
    )];
    expect(result).toEqual(["none"]);
});

test('sync defaultIfEmpty – after filter that removes everything', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        filter(x => x > 100),
        defaultIfEmpty(-1)
    )];
    expect(result).toEqual([-1]);
});

test('sync defaultIfEmpty – after filter that keeps some', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        filter(x => x >= 3),
        defaultIfEmpty(-1)
    )];
    expect(result).toEqual([3, 4]);
});

test('sync defaultIfEmpty – works with map', () => {
    const result = [...pipeSync(
        [],
        defaultIfEmpty(5),
        map(x => (x as number) * 10)
    )];
    expect(result).toEqual([50]);
});

test('sync defaultIfEmpty – default null', () => {
    const result = [...pipeSync(
        [],
        defaultIfEmpty(null)
    )];
    expect(result).toEqual([null]);
});

// ---------- Async ----------

test('async defaultIfEmpty – empty source emits default', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            defaultIfEmpty(99)
        )
    );
    expect(result).toEqual([99]);
});

test('async defaultIfEmpty – non-empty ignores default', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4),
            defaultIfEmpty(0)
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async defaultIfEmpty – after filter empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            filter(x => false),
            defaultIfEmpty("empty")
        )
    );
    expect(result).toEqual(["empty"]);
});

test('async defaultIfEmpty – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            defaultIfEmpty(3),
            map(x => (x as number) * 2)
        )
    );
    expect(result).toEqual([6]);
});