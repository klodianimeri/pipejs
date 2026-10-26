import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { delayEach } from '../pipes/delay-each.js'; // adjust path
import { map } from '../pipes/map.js';

// ---------- Sync (should not be used) ----------

test('sync delayEach – throws or is ignored (not supported)', () => {
    // delayEach is async-only. If someone puts it in a sync pipe
    // the engine will receive a Promise and most likely blow up.
    // We just document that it is not supported.
    expect(() => {
        const pipe = pipeSync(
            sequenceSync(0, 3),
            delayEach(10)
        );
        // force consumption
        [...pipe];
    }).toThrow(); // or whatever error your sync engine produces
});

// ---------- Async ----------

test('async delayEach – delays each value', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delayEach(50)
    );

    const iterator = pipe[Symbol.asyncIterator]();

    const v0 = await iterator.next();
    const t0 = Date.now() - start;
    expect(v0.value).toBe(0);
    expect(t0).toBeGreaterThanOrEqual(45); // allow a little jitter

    const v1 = await iterator.next();
    const t1 = Date.now() - start;
    expect(v1.value).toBe(1);
    expect(t1).toBeGreaterThanOrEqual(95);

    const v2 = await iterator.next();
    const t2 = Date.now() - start;
    expect(v2.value).toBe(2);
    expect(t2).toBeGreaterThanOrEqual(145);

    expect((await iterator.next()).done).toBe(true);
});

test('async delayEach – works with other operators', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        delayEach(30),
        map(x => x * 10)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    expect(result).toEqual([0, 10, 20, 30]);
});

test('async delayEach – zero delay is almost immediate', async () => {
    const start = Date.now();

    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        delayEach(0)
    );

    const values: number[] = [];
    for await (const v of pipe) {
        values.push(v);
    }

    const elapsed = Date.now() - start;
    expect(values).toEqual([0, 1, 2]);
    expect(elapsed).toBeLessThan(50); // should be very fast
});

test('async delayEach – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        delayEach(100)
    );

    const iterator = pipe[Symbol.asyncIterator]();
    expect((await iterator.next()).done).toBe(true);
});

test('async delayEach – preserves order', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        delayEach(20)
    );

    const result: number[] = [];
    for await (const v of pipe) {
        result.push(v);
    }

    expect(result).toEqual([0, 1, 2, 3, 4]);
});