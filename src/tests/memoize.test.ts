import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { memoize } from '../pipes/memoize.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync memoize – passes values through and caches them', () => {
    const pipe = pipeSync(
        sequenceSync(0, 4),
        memoize()
    );

    const result = [...pipe];
    const memoized = [...pipe];

    expect(result).toEqual([0, 1, 2, 3]);
    expect(memoized).toEqual([0, 1, 2, 3]);
});

test('sync memoize – works with map', () => {
    const pipe = pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        memoize()
    );

    const result = [...pipe];
    const memoized = [...pipe];
    expect(result).toEqual([0, 10, 20]);
    expect(memoized).toEqual([0, 10, 20]);
});

test('sync memoize – empty source', () => {
    const pipe = pipeSync(
        sequenceSync(0, 0),
        memoize()
    );

    const result = [...pipe];
    const memoized = [...pipe];

    expect(result).toEqual([]);
    expect(memoized).toEqual([]);
});

test('sync memoize – single value', () => {
    const pipe = pipeSync(
        sequenceSync(5, 6),
        memoize()
    );

    const result = [...pipe];
    const memoized = [...pipe];

    expect(result).toEqual([5]);
    expect(memoized).toEqual([5]);
});

// ---------- Async ----------

test('async memoize – passes values through and caches them', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        memoize()
    );

    const result = await collectAsync(pipe);
    const memoized = await collectAsync(pipe);

    expect(result).toEqual([0, 1, 2, 3]);
    expect(memoized).toEqual([0, 1, 2, 3]);
});

test('async memoize – works with map', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        map(x => x * 10),
        memoize()
    );

    const result = await collectAsync(pipe);
    const memoized = await collectAsync(pipe);

    expect(result).toEqual([0, 10, 20]);
    expect(memoized).toEqual([0, 10, 20]);
});

test('async memoize – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        memoize()
    );
    const result = await collectAsync(pipe);
    const memoized = await collectAsync(pipe);

    expect(result).toEqual([]);
    expect(memoized).toEqual([]);
});

test('async memoize – single value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(5, 6),
        memoize()
    );

    const result = await collectAsync(pipe);
    const memoized = await collectAsync(pipe);

    expect(result).toEqual([5]);
    expect(memoized).toEqual([5]);
});