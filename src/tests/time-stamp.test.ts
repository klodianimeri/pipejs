import { pipeAsync } from "../async/pipe-async.js";
import { timeStamp } from '../pipes/time-stamp.js';
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

test('async timeStamp – attaches a timestamp to each value', async () => {
    const before = Date.now();

    const pipe = pipeAsync(
        timer(40, 4),                     // 0..3
        timeStamp()
    );

    const result = await collectAsync(pipe);
    const after = Date.now();

    expect(result.length).toBe(4);

    result.forEach((item, i) => {
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('time');
        expect(item.value).toBe(i);
        expect(typeof item.time).toBe('number');
        expect(item.time).toBeGreaterThanOrEqual(before);
        expect(item.time).toBeLessThanOrEqual(after);
    });

    // Timestamps should be non-decreasing
    for (let i = 1; i < result.length; i++) {
        expect(result[i].time).toBeGreaterThanOrEqual(result[i - 1].time);
    }
});

test('async timeStamp – works with delayEach', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delayEach(30),
        timeStamp()
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(3);
    expect(result[0].value).toBe(0);
    expect(result[1].value).toBe(1);
    expect(result[2].value).toBe(2);

    // Later timestamps should be larger
    expect(result[1].time).toBeGreaterThanOrEqual(result[0].time);
    expect(result[2].time).toBeGreaterThanOrEqual(result[1].time);
});

test('async timeStamp – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        timeStamp()
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

test('async timeStamp – single value', async () => {
    const before = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(42, 43),
        timeStamp()
    );

    const result = await collectAsync(pipe);
    const after = Date.now();

    expect(result.length).toBe(1);
    expect(result[0].value).toBe(42);
    expect(result[0].time).toBeGreaterThanOrEqual(before);
    expect(result[0].time).toBeLessThanOrEqual(after);
});

// ---------- Composition ----------

test('async timeStamp – works with map', async () => {
    const pipe = pipeAsync(
        timer(20, 4),
        timeStamp(),
        map(({ value, time }) => ({ value: value * 10, time }))
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(4);
    result.forEach((item, i) => {
        expect(item.value).toBe(i * 10);
        expect(typeof item.time).toBe('number');
    });
});

// ---------- Edge cases ----------

test('async timeStamp – rapid synchronous source', async () => {
    const before = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        timeStamp()
    );

    const result = await collectAsync(pipe);
    const after = Date.now();

    expect(result.length).toBe(5);
    result.forEach((item, i) => {
        expect(item.value).toBe(i);
        expect(item.time).toBeGreaterThanOrEqual(before);
        expect(item.time).toBeLessThanOrEqual(after);
    });
});

test('async timeStamp – preserves order of values', async () => {
    const pipe = pipeAsync(
        timer(15, 6),
        timeStamp()
    );

    const result = await collectAsync(pipe);

    for (let i = 1; i < result.length; i++) {
        expect(result[i].value).toBeGreaterThan(result[i - 1].value);
        expect(result[i].time).toBeGreaterThanOrEqual(result[i - 1].time);
    }
});