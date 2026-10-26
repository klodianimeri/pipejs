import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync } from "./sequence.test.js";
import { bufferTime } from '../pipes/buffer-time.js';
import { delayEach } from '../pipes/delay-each.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

// Helper
async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async bufferTime – emits buffers on time boundaries', async () => {
    const pipe = pipeAsync(
        timer(30, 10),                 // 0..9 every 30 ms
        bufferTime(100)
    );

    const result = await collect(pipe);

    // Should produce several arrays
    expect(result.length).toBeGreaterThan(1);
    expect(result.every(Array.isArray)).toBe(true);

    // Flattened values stay in order and contain everything
    expect(result.reduce((acc, val) => acc.concat(val), [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('async bufferTime – zero interval emits every value as a singleton', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        bufferTime(0)
    );

    const result = await collect(pipe);
    expect(result).toEqual([[0], [1], [2], [3], [4]]);
});

test('async bufferTime – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        bufferTime(50)
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

// ---------- Composition ----------

test('async bufferTime – works with map after buffering', async () => {
    const pipe = pipeAsync(
        timer(25, 6),
        bufferTime(80),
        map((buf: number[]) => buf.map(x => x * 10))
    );

    const result = await collect(pipe);

    expect(result.every(Array.isArray)).toBe(true);
    expect(result.reduce((acc, val) => acc.concat(val), [])).toEqual([0, 10, 20, 30, 40, 50]);
});

// ---------- Edge cases ----------

test('async bufferTime – long interval buffers everything into one array', async () => {
    const pipe = pipeAsync(
        timer(20, 5),                  // 0..4
        bufferTime(200)                // longer than total duration
    );

    const result = await collect(pipe);

    // Everything ends up in a single buffer (flushed on DONE)
    expect(result).toEqual([[0, 1, 2, 3, 4]]);
});

test('async bufferTime – rapid synchronous source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 8),
        bufferTime(50)
    );

    const result = await collect(pipe);

    // All values arrive inside the same window → one buffer
    expect(result).toEqual([[0, 1, 2, 3, 4, 5, 6, 7]]);
});

test('async bufferTime – flushes remaining items on completion', async () => {
    const pipe = pipeAsync(
        timer(40, 5),                  // 0..4
        bufferTime(100)
    );

    const result = await collect(pipe);

    // Last buffer may be partial and must still be emitted
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.reduce((acc, val) => acc.concat(val), [])).toEqual([0, 1, 2, 3, 4]);
});

test('async bufferTime – preserves order inside and across buffers', async () => {
    const pipe = pipeAsync(
        timer(20, 12),
        bufferTime(70)
    );

    const result = await collect(pipe);
    const flat = result.reduce((acc, val) => acc.concat(val), []);

    for (let i = 1; i < flat.length; i++) {
        expect(flat[i]).toBeGreaterThan(flat[i - 1]);
    }
});