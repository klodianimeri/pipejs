import { pipeAsync } from "../async/pipe-async.js";
import { switchMap } from '../pipes/switch-map.js';
import { map } from '../pipes/map.js';
import {
    toGeneratorAsync,
    toDelayAsync,
    sequenceAsync,
    sequenceIntervalAsync,
} from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async switchMap – projects and switches to the latest inner', async () => {
    const pipe = pipeAsync(
        sequenceIntervalAsync(0, 4, 40),          // 0,1,2,3 every 40 ms
        switchMap(x => toDelayAsync([x * 10, x * 10 + 1], 25))
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBeGreaterThan(0);
    // Later values should dominate because of switching
    expect(result[result.length - 1]).toBeGreaterThanOrEqual(30);
});

test('async switchMap – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        switchMap(x => toDelayAsync([x], 10))
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

test('async switchMap – single value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(5, 6),                      // [5]
        switchMap(x => toGeneratorAsync([x * 10, x * 10 + 1, x * 10 + 2]))
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([50, 51, 52]);
});

test('async switchMap – projection returns empty', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        switchMap(() => toGeneratorAsync([]))
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

// ---------- Composition ----------

test('async switchMap – works with map', async () => {
    const pipe = pipeAsync(
        sequenceIntervalAsync(0, 3, 30),
        switchMap(x => toDelayAsync([x, x + 1], 20)),
        map(v => v * 10)
    );

    const result = await collectAsync(pipe);

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
});

// ---------- Switching behaviour ----------

test('async switchMap – rapid source cancels previous projections', async () => {
    const pipe = pipeAsync(
        sequenceIntervalAsync(0, 5, 15),          // fast outer
        switchMap(x => toDelayAsync(
            [x * 100, x * 100 + 1, x * 100 + 2, x * 100 + 3],
            40                                    // slower inner
        ))
    );

    const result = await collectAsync(pipe);

    // Because the outer is faster than the inners, most early projections
    // should have been cancelled. We mainly expect values from later outer values.
    const fromEarly = result.filter(v => v < 200);
    expect(fromEarly.length).toBeLessThan(6);
    expect(result.some(v => v >= 400)).toBe(true);
});

test('async switchMap – last projection runs to completion', async () => {
    const pipe = pipeAsync(
        sequenceIntervalAsync(0, 3, 30),
        switchMap(x => toDelayAsync([x * 10, x * 10 + 1, x * 10 + 2], 20))
    );

    const result = await collectAsync(pipe);

    // The final projection (for x = 2) should be fully present
    expect(result).toContain(20);
    expect(result).toContain(21);
    expect(result).toContain(22);
});

test('async switchMap – index is passed to project', async () => {
    const indexes: number[] = [];

    const pipe = pipeAsync(
        sequenceAsync(10, 13),                    // 10,11,12
        switchMap((value, index) => {
            indexes.push(index);
            return toGeneratorAsync([value]);
        })
    );

    const result = await collectAsync(pipe);

    expect(result).toEqual([10, 11, 12]);
    expect(indexes).toEqual([0, 1, 2]);
});