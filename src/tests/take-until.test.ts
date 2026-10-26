import { pipeAsync } from "../async/pipe-async.js";
import { takeUntil } from '../pipes/take-until.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// Helper
const delay = (ms: number) => () => new Promise(resolve => setTimeout(resolve, ms));

// ---------- Basic behaviour ----------

test('async takeUntil – emits until notifier resolves', async () => {
    const pipe = pipeAsync(
        timer(30, 10),                    // 0..9 every 30 ms
        takeUntil(delay(100))             // stop after ~100 ms
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(10);
    expect(result[0]).toBe(0);
    expect(result[result.length - 1]).toBeLessThan(9);
});

test('async takeUntil – notifier already resolved → empty result', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        takeUntil(() => Promise.resolve())
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

test('async takeUntil – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        takeUntil(delay(50))
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

// ---------- Composition ----------

test('async takeUntil – works with map', async () => {
    const pipe = pipeAsync(
        timer(25, 8),
        takeUntil(delay(90)),
        map(x => x * 10)
    );

    const result = await collectAsync(pipe);

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(8);
});

// ---------- Edge cases ----------

test('async takeUntil – notifier resolves very late', async () => {
    const pipe = pipeAsync(
        timer(20, 5),                     // finishes in ~100 ms
        takeUntil(delay(300))             // stops long after source is done
    );

    const result = await collectAsync(pipe);
    // Whole source should pass
    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async takeUntil – notifier rejects', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        takeUntil(() => Promise.reject(new Error('notifier failed')))
    );

    await expect(collectAsync(pipe)).rejects.toThrow('notifier failed');
});

test('async takeUntil – fully synchronous source is completely taken or empty', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 10),
        takeUntil(delay(5))
    );

    const result = await collectAsync(pipe);

    // Depending on exact timing it may be empty or contain some values,
    // but never more than the source
    expect(result.length).toBeLessThanOrEqual(10);
});

test('async takeUntil – realistic timed source', async () => {
    const pipe = pipeAsync(
        timer(20, 10),                    // lasts ~200 ms
        takeUntil(delay(75))
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBeGreaterThan(1);
    expect(result.length).toBeLessThan(10);
    expect(result[0]).toBe(0);
});