import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync, sequenceIntervalAsync } from "./sequence.test.js";
import { throttleTime } from '../pipes/throttle-time.js';
import { delayEach } from '../pipes/delay-each.js';
import { map } from '../pipes/map.js';

// ---------- Basic behaviour ----------

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

async function* timed<T>(items: T[], gapMs: number): AsyncIterable<T> {
    for (const item of items) {
        yield item;
        await delay(gapMs);
    }
}


test('async throttleTime – rapid values → leading only in window', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3, 4], 20),
            throttleTime(100)
        )
    );
    // first emitted; rest within 100ms dropped
    expect(result).toEqual([1]);
});

test('async throttleTime – gaps longer than dueTime → each value', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 150),
            throttleTime(50)
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async throttleTime – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            throttleTime(50)
        )
    );
    expect(result).toEqual([]);
});

test('async throttleTime – works after map', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 20),
            map(x => x * 10),
            throttleTime(100)
        )
    );
    expect(result).toEqual([10]);
});

test('async Time – emits first value then drops until window expires', async () => {

    // Produce a value every ~30 ms
    const pipe = pipeAsync(
        sequenceAsync(0, 10),
        delayEach(30),
        // sequenceIntervalAsync(0, 10, 30),
        throttleTime(100)
    );

    const result: number[] = [];
    const timestamps: number[] = [];

    const start = performance.now();

    for await (const v of pipe) {
        result.push(v);
        timestamps.push(performance.now() - start);
    }

    // Should keep roughly every 100 ms → indices 0, 4, 8 …
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result[0]).toBe(0);

    // Check that gaps between emissions are roughly ≥ 100 ms
    for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i] - timestamps[i - 1]).toBeGreaterThanOrEqual(90);
    }
});

test('async throttle – zero duration lets everything through', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        throttleTime(0)
    );

    const result: number[] = [];

    for await (const v of pipe) {
        result.push(v);
    }

    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async throttle – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        throttleTime(100)
    );

    const iterator = pipe[Symbol.asyncIterator]();
    expect((await iterator.next()).done).toBe(true);
});

// ---------- Composition ----------

test('async throttle – works with map and delayEach', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 8),
        delayEach(25),
        map(x => x * 10),
        throttleTime(80)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    // Values are mapped
    expect(result.every(v => v % 10 === 0)).toBe(true);
    // And throttled (far fewer than 8 values)
    expect(result.length).toBeLessThan(6);
    expect(result[0]).toBe(0);
});

// ---------- Edge cases ----------

test('async throttle – very long window keeps only the first value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        delayEach(20),
        throttleTime(1000)          // 1 second window
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    // Only the first value should pass
    expect(result).toEqual([0]);
});

test('async throttle – fast source with tiny delay spans multiple windows', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 15),
        delayEach(5),          // 5 ms between values
        throttleTime(40)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    // Should emit several values (roughly every 40 ms)
    expect(result.length).toBeGreaterThan(2);
    expect(result.length).toBeLessThan(10);
    expect(result[0]).toBe(0);

    // Values stay in order
    for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
    }
});


test('async throttle – preserves order of emitted values', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 15),
        delayEach(20),
        throttleTime(70)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    // Emitted values must be in ascending order
    for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
    }
});