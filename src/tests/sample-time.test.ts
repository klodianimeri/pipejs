import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync } from "./sequence.test.js";
import { sampleTime } from '../pipes/sample-time.js';
import { delayEach } from '../pipes/delay-each.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

test('async sampleTime – emits latest value on time boundaries', async () => {
    const pipe = pipeAsync(
        timer(30, 10),                 // 0..9 every 30 ms
        sampleTime(100)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(1);
    expect(result.length).toBeLessThan(6);
    // Values should be increasing
    for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
    }
});

test('async sampleTime – zero interval emits every value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        sampleTime(0)
    );

    const result = await collect(pipe);
    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async sampleTime – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        sampleTime(50)
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

test('async sampleTime – long interval emits nothing', async () => {
    const pipe = pipeAsync(
        timer(20, 5),
        sampleTime(200)
    );

    const result = await collect(pipe);
    // With the current implementation (no flush on DONE) → empty
    expect(result).toEqual([]);
});

test('async sampleTime – rapid synchronous source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 8),
        sampleTime(50)
    );

    const result = await collect(pipe);
    // Everything arrives inside one window → nothing emitted
    expect(result).toEqual([]);
});

test('async sampleTime – works with map', async () => {
    const pipe = pipeAsync(
        timer(25, 8),
        sampleTime(80),
        map(x => x * 10)
    );

    const result = await collect(pipe);

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
});