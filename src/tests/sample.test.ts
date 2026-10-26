import { pipeAsync } from "../async/pipe-async.js";
import { sequenceAsync } from "./sequence.test.js";
import { sample } from '../pipes/sample.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

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

async function* interval(ms: number, count: number): AsyncIterable<number> {
    for (let i = 0; i < count; i++) {
        await delay(ms);
        yield i;
    }
}

async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}


test('async sample – notifier ticks emit latest on following pull', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([10, 20, 30, 40], 40),
            sample(interval(100, 5))
        )
    );
    // at least one sampled value; all values come from source
    expect(result.length).toBeGreaterThanOrEqual(1);
    for (const v of result) {
        expect([10, 20, 30, 40]).toContain(v);
    }
});

test('async sample – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            sample(interval(20, 3))
        )
    );
    expect(result).toEqual([]);
});

test('async sample – slow source, fast notifier', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 120),
            sample(interval(30, 10))
        )
    );
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.every(v => [1, 2, 3].indexOf(v) !== -1)).toBe(true);
});


test('async sample – emits latest value when notifier fires', async () => {
    const source = timer(30, 10);               // 0..9
    const notifier = timer(100, 5);

    const pipe = pipeAsync(
        source,
        sample(notifier)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThan(1);
    expect(result.length).toBeLessThanOrEqual(5);

    // Values stay in increasing order
    for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
    }
});

test('async sample – empty source', async () => {
    const pipe = pipeAsync(
        timer(10, 0),
        sample(timer(50, 3))
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

test('async sample – notifier slower than source', async () => {
    const source = timer(20, 8);
    const notifier = timer(150, 2);

    const pipe = pipeAsync(
        source,
        sample(notifier)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(3);
});

test('async sample – notifier finishes before source', async () => {
    const source = timer(30, 8);
    const notifier = timer(40, 2);

    const pipe = pipeAsync(
        source,
        sample(notifier)
    );

    const result = await collect(pipe);

    expect(result.length).toBeGreaterThanOrEqual(1);
    // No more emissions after notifier is exhausted
});

test('async sample – works with map', async () => {
    const source = timer(25, 6);
    const notifier = timer(80, 4);

    const pipe = pipeAsync(
        source,
        sample(notifier),
        map(x => x * 10)
    );

    const result = await collect(pipe);

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
});

test('async sample – rapid source with slow notifier', async () => {
    const source = sequenceAsync(0, 10);        // synchronous burst
    const notifier = timer(50, 3);

    const pipe = pipeAsync(
        source,
        sample(notifier)
    );

    const result = await collect(pipe);

    // Only values that happen to be present when notifier fires
    expect(result.length).toBeLessThanOrEqual(3);
});