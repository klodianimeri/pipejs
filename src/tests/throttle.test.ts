// tests
import { pipeAsync } from "../async/pipe-async.js";
import { delayEach, map } from "../pipes/index.js";
import { throttle } from '../pipes/throttle.js';
import { sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

function timer(ms: number): AsyncIterable<void> {
    return {
        async *[Symbol.asyncIterator]() {
            if (ms > 0) await delay(ms);
            yield;
        },
    };
}

async function* timed<T>(items: T[], gapMs: number): AsyncIterable<T> {
    for (const item of items) {
        yield item;
        await delay(gapMs);
    }
}

test('async throttle – rapid values → leading only', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3, 4], 20),
            throttle(() => timer(100))
        )
    );
    expect(result).toEqual([1]);
});

test('async throttle – gaps longer than notifier → each value', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 150),
            throttle(() => timer(50))
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async throttle – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            throttle(() => timer(50))
        )
    );
    expect(result).toEqual([]);
});

test('async throttle – immediate notifier passes through', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 10),
            throttle(() => timer(0))
        )
    );
    expect(result).toEqual([1, 2, 3]);
});


// // ---------- Composition ----------

test('async throttle – works with map and delayEach', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 8),
        delayEach(25),
        map(x => x * 10),
        throttle(() => timer(80))
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

test('async throttle – very long window keeps only the first value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        delayEach(20),
        throttle(() => timer(1000))          // 1 second window
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
        throttle(() => timer(40))
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
        throttle(() => timer(70))
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