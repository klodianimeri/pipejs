import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { delay } from '../pipes/delay.js'; // adjust path
import { map } from '../pipes/map.js';
import { delayEach } from "../pipes/delay-each.js";

// // ---------- Sync (not supported) ----------

test('sync delay – not supported', () => {
    expect(() => {
        const pipe = pipeSync(
            sequenceSync(0, 3),
            delay(10)
        );
        [...pipe];
    }).toThrow();
});

// ---------- Async ----------

test('async delay – delays only once before first value', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delay(80)
    );

    const iterator = pipe[Symbol.asyncIterator]();

    // First value should be delayed
    const v0 = await iterator.next();
    const t0 = Date.now() - start;
    expect(v0.value).toBe(0);
    expect(t0).toBeGreaterThanOrEqual(70);

    // Subsequent values should arrive quickly
    const v1 = await iterator.next();
    const t1 = Date.now() - start;
    expect(v1.value).toBe(1);
    expect(t1 - t0).toBeLessThan(30); // almost immediate

    const v2 = await iterator.next();
    const t2 = Date.now() - start;
    expect(v2.value).toBe(2);
    expect(t2 - t1).toBeLessThan(30);

    expect((await iterator.next()).done).toBe(true);
});

test('async delay – works with other operators', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        delay(50),
        map(x => x * 10)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    expect(result).toEqual([0, 10, 20, 30]);
});

test('async delay – zero delay is almost immediate', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delay(0)
    );

    const values: number[] = [];
    for await (const v of pipe) {
        values.push(v);
    }

    const elapsed = Date.now() - start;
    expect(values).toEqual([0, 1, 2]);
    expect(elapsed).toBeLessThan(40);
});

test('async delay – empty source still respects the delay', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        delay(60)
    );

    const iterator = pipe[Symbol.asyncIterator]();
    const res = await iterator.next();
    const elapsed = Date.now() - start;

    expect(res.done).toBe(true);
    expect(elapsed).toBeGreaterThanOrEqual(50);
});

test('async delay – preserves order', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        delay(40)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async delay – only the first consumer pays the delay', async () => {
    // The delay flag lives inside the operator instance,
    // so each new pipeAsync(...) gets its own delay.
    const pipe1 = pipeAsync(sequenceAsync(0, 2), delay(50));
    const pipe2 = pipeAsync(sequenceAsync(10, 12), delay(50));

    const start = Date.now();

    const v1 = await pipe1[Symbol.asyncIterator]().next();
    const t1 = Date.now() - start;
    expect(v1.value).toBe(0);
    expect(t1).toBeGreaterThanOrEqual(45);

    const v2 = await pipe2[Symbol.asyncIterator]().next();
    const t2 = Date.now() - start;
    expect(v2.value).toBe(10);
    // second pipe also pays its own delay
    expect(t2).toBeGreaterThanOrEqual(90);
});

test('async – multiple async operators in the chain (delay + map + delayEach)', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        delay(60),               // one-time delay before the first value
        map(x => x * 10),
        delayEach(40)            // delay every value
    );

    const iterator = pipe[Symbol.asyncIterator]();
    const timestamps: number[] = [];
    const values: number[] = [];

    for (let i = 0; i < 4; i++) {
        const res = await iterator.next();
        values.push(res.value);
        timestamps.push(Date.now() - start);
    }

    expect((await iterator.next()).done).toBe(true);

    // Values are transformed by map
    expect(values).toEqual([0, 10, 20, 30]);

    // Timing expectations (with some tolerance for timer jitter)
    // First value: ~60 ms (initial delay) + ~40 ms (delayEach) ≈ 100 ms
    expect(timestamps[0]).toBeGreaterThanOrEqual(90);

    // Subsequent values: roughly +40 ms each
    expect(timestamps[1]).toBeGreaterThanOrEqual(timestamps[0] + 30);
    expect(timestamps[2]).toBeGreaterThanOrEqual(timestamps[1] + 30);
    expect(timestamps[3]).toBeGreaterThanOrEqual(timestamps[2] + 30);
});