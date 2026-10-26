import { pipeAsync } from "../async/pipe-async.js";
import { timeInterval } from '../pipes/time-interval.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceAsync } from "./sequence.test.js";
import { delayEach } from '../pipes/delay-each.js';

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async timeInterval – attaches elapsed time to each value', async () => {
    const pipe = pipeAsync(
        timer(50, 4),                     // 0..3 every 50 ms
        timeInterval()
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(4);

    result.forEach((item, i) => {
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('elapsed');
        expect(item.value).toBe(i);
        expect(typeof item.elapsed).toBe('number');
        expect(item.elapsed).toBeGreaterThanOrEqual(0);
    });

    // Subsequent intervals should be roughly 50 ms
    for (let i = 1; i < result.length; i++) {
        expect(result[i].elapsed).toBeGreaterThanOrEqual(40);
        expect(result[i].elapsed).toBeLessThan(120);
    }
});

test('async timeInterval – works with delayEach', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delayEach(40),
        timeInterval()
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(3);
    expect(result[0].value).toBe(0);
    expect(result[1].value).toBe(1);
    expect(result[2].value).toBe(2);

    // First elapsed is from operator init to first value (small)
    // Later ones should be close to the delay
    expect(result[1].elapsed).toBeGreaterThanOrEqual(30);
    expect(result[2].elapsed).toBeGreaterThanOrEqual(30);
});

test('async timeInterval – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        timeInterval()
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

test('async timeInterval – single value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(7, 8),
        timeInterval()
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0].value).toBe(7);
    expect(result[0].elapsed).toBeGreaterThanOrEqual(0);
});

// ---------- Composition ----------

test('async timeInterval – works with map', async () => {
    const pipe = pipeAsync(
        timer(30, 4),
        timeInterval(),
        map(({ value, elapsed }) => ({ value: value * 10, elapsed }))
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(4);
    result.forEach((item, i) => {
        expect(item.value).toBe(i * 10);
        expect(typeof item.elapsed).toBe('number');
    });
});

// ---------- Edge cases ----------

test('async timeInterval – rapid synchronous source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        timeInterval()
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(5);
    result.forEach((item, i) => {
        expect(item.value).toBe(i);
        // Elapsed times should be very small
        expect(item.elapsed).toBeLessThan(20);
    });
});

test('async timeInterval – preserves order', async () => {
    const pipe = pipeAsync(
        timer(20, 6),
        timeInterval()
    );

    const result = await collectAsync(pipe);

    for (let i = 1; i < result.length; i++) {
        expect(result[i].value).toBeGreaterThan(result[i - 1].value);
    }
});