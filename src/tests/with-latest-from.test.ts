import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync } from "./sequence.test.js";
import { withLatestFrom } from '../pipes/with-latest-from.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async withLatestFrom – combines with latest values', async () => {
    const main = timer(40, 6);          // 0..5
    const other1 = timer(70, 4);          // 0..3
    const other2 = timer(100, 3);         // 0..2

    const pipe = pipeAsync(
        main,
        withLatestFrom(other1, other2)
    );

    const result = await collect(pipe);

    // Should have some emissions (after all secondaries have started)
    expect(result.length).toBeGreaterThan(0);

    // Each item is a tuple [main, other1, other2]
    result.forEach(item => {
        expect(Array.isArray(item)).toBe(true);
        expect(item.length).toBe(3);
    });

    // Main values are increasing
    for (let i = 1; i < result.length; i++) {
        expect(result[i][0]).toBeGreaterThan(result[i - 1][0]);
    }
});

test('async withLatestFrom – waits until all secondaries have values', async () => {
    const main = timer(20, 5);
    const slow = timer(150, 2);         // very slow secondary

    const pipe = pipeAsync(
        main,
        withLatestFrom(slow)
    );

    const result = await collect(pipe);

    // First emissions may be missing until the slow secondary produces a value
    expect(result.length).toBeLessThanOrEqual(5);
    result.forEach(([m, s]) => {
        expect(typeof m).toBe('number');
        expect(typeof s).toBe('number');
    });
});

test('async withLatestFrom – empty main source', async () => {
    const pipe = pipeAsync(
        timer(10, 0),
        withLatestFrom(timer(30, 3))
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

test('async withLatestFrom – single secondary', async () => {
    const main = timer(30, 5);
    const other = timer(50, 4);

    const pipe = pipeAsync(
        main,
        withLatestFrom(other)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => {
        expect(item.length).toBe(2);
    });
});

// ---------- Composition ----------

test('async withLatestFrom – works with map', async () => {
    const main = timer(30, 5);
    const other = timer(60, 3);

    const pipe = pipeAsync(
        main,
        withLatestFrom(other),
        map(([m, o]) => m * 10 + o)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(v => typeof v === 'number')).toBe(true);
});

// ---------- Edge cases ----------

test('async withLatestFrom – rapid main source', async () => {
    const main = sequenceAsync(0, 6);    // synchronous burst
    const other = timer(40, 3);

    const pipe = pipeAsync(
        main,
        withLatestFrom(other)
    );

    const result = await collect(pipe);

    // Only values that arrive after the secondary has produced something
    expect(result.length).toBeLessThanOrEqual(6);
});

test('async withLatestFrom – secondary finishes early', async () => {
    const main = timer(30, 8);
    const other = timer(40, 2);           // finishes quickly

    const pipe = pipeAsync(
        main,
        withLatestFrom(other)
    );

    const result = await collect(pipe);

    // Still emits using the last known value from the secondary
    expect(result.length).toBeGreaterThan(0);
    result.forEach(([m, o]) => {
        expect(o).toBeLessThanOrEqual(1);
    });
});

test('async withLatestFrom – multiple secondaries', async () => {
    const main = timer(40, 5);
    const a = timer(60, 4);
    const b = timer(80, 3);
    const c = timer(100, 2);

    const pipe = pipeAsync(
        main,
        withLatestFrom(a, b, c)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => {
        expect(item.length).toBe(4);   // main + 3 secondaries
    });
});