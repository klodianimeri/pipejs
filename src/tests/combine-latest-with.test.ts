import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync, toDelayAsync } from "./sequence.test.js";
import { combineLatestWith } from '../pipes/combine-latest-with.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async combineLatestWith – emits combined values', async () => {
    const main = timer(40, 6);          // 0..5
    const other1 = timer(40, 4);          // 0..3
    const other2 = timer(40, 8);         // 0..2

    const pipe = pipeAsync(
        main,
        combineLatestWith(other1, other2)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);

    result.forEach(item => {
        expect(Array.isArray(item)).toBe(true);
        expect(item.length).toBe(3);
    });

    // Main values should be non-decreasing
    for (let i = 1; i < result.length; i++) {
        expect(result[i][0]).toBeGreaterThanOrEqual(result[i - 1][0]);
    }
});

test('async combineLatestWith – waits until all sources have values', async () => {
    const main = timer(20, 5);
    const slow = timer(150, 2);

    const pipe = pipeAsync(
        main,
        combineLatestWith(slow)
    );

    const result = await collect(pipe);

    expect(result.length).toBeLessThanOrEqual(6);

    result.forEach(([m, s]) => {
        expect(typeof m).toBe('number');
        expect(typeof s).toBe('number');
    });
});

test('async combineLatestWith – empty main source', async () => {
    const pipe = pipeAsync(
        timer(10, 0),
        combineLatestWith(timer(30, 3))
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

test('async combineLatestWith – single secondary', async () => {
    const main = timer(30, 5);
    const other = timer(50, 4);

    const pipe = pipeAsync(
        main,
        combineLatestWith(other)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => {
        expect(item.length).toBe(2);
    });
});

// ---------- Composition ----------

test('async combineLatestWith – works with map', async () => {
    const main = timer(30, 5);
    const other = timer(60, 3);

    const pipe = pipeAsync(
        main,
        combineLatestWith(other),
        map(([m, o]) => m * 10 + o)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(v => typeof v === 'number')).toBe(true);
});

// ---------- Edge cases ----------

test('async combineLatestWith – rapid main source', async () => {
    const main = sequenceAsync(0, 6);
    const other = timer(40, 3);

    const pipe = pipeAsync(
        main,
        combineLatestWith(other)
    );

    const result = await collect(pipe);


    expect(result.length).toBeLessThanOrEqual(8);
});

test('async combineLatestWith – secondary finishes early', async () => {
    const main = timer(30, 8);
    const other = timer(40, 2);

    const pipe = pipeAsync(
        main,
        combineLatestWith(other)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    result.forEach(([m, o]) => {
        expect(o).toBeLessThanOrEqual(1);
    });
});

test('async combineLatestWith – multiple secondaries', async () => {
    const main = timer(40, 5);
    const a = timer(60, 4);
    const b = timer(80, 3);
    const c = timer(100, 2);

    const pipe = pipeAsync(
        main,
        combineLatestWith(a, b, c)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => {
        expect(item.length).toBe(4);
    });
});