import { pipeAsync } from "../async/pipe-async.js";
import { skipUntil } from '../pipes/skip-until.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// Helper – resolves after `ms` milliseconds
const delay = (ms: number) => () => new Promise(resolve => setTimeout(resolve, ms));

// ---------- Basic behaviour ----------

test('async skipUntil – skips values until notifier resolves', async () => {
    const pipe = pipeAsync(
        timer(30, 8),                     // 0..7 every 30 ms
        skipUntil(delay(100))             // open after 100 ms
    );

    const result = await collectAsync(pipe);


    // First values should have been skipped
    expect(result.length).toBeLessThan(8);
    expect(result[0]).toBeGreaterThan(0); // did not start from 0
    expect(result[result.length - 1]).toBe(7);
});

test('async skipUntil – notifier already resolved → nothing skipped', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        skipUntil(() => Promise.resolve())
    );

    const result = await collectAsync(pipe);

    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async skipUntil – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        skipUntil(delay(50))
    );

    const result = await collectAsync(pipe);

    expect(result).toEqual([]);
});

// ---------- Composition ----------

test('async skipUntil – works with map', async () => {
    const pipe = pipeAsync(
        timer(25, 6),
        skipUntil(delay(80)),
        map(x => x * 10)
    );

    const result = await collectAsync(pipe);

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(6);
});

// ---------- Edge cases ----------

test('async skipUntil – notifier resolves very late', async () => {
    const pipe = pipeAsync(
        timer(20, 5),                     // finishes in ~100 ms
        skipUntil(delay(300))             // opens long after source is done
    );

    const result = await collectAsync(pipe);
    // Everything was skipped
    expect(result).toEqual([]);
});

test('async skipUntil – notifier rejects', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        skipUntil(() => Promise.reject(new Error('notifier failed')))
    );

    await expect(collectAsync(pipe)).rejects.toThrow('notifier failed');
});

test('async skipUntil – rapid source still open when notifier is fast', async () => {
    const pipe = pipeAsync(
        timer(5, 10),                     // values every 5 ms → lasts ~50 ms
        skipUntil(delay(15))              // opens after 15 ms
    );

    const result = await collectAsync(pipe);

    // Should have skipped the first few values
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(10);
    expect(result[0]).toBeGreaterThan(0);
    expect(result[result.length - 1]).toBe(9);
});

test('async skipUntil – fully synchronous source is completely skipped', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 10),
        skipUntil(delay(5))
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);          // everything was skipped
});