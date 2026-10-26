import { pipeAsync } from "../async/pipe-async.js";
import { switchAll } from '../pipes/switch-all.js';
import { map } from '../pipes/map.js';
import {
    toGeneratorAsync,
    toDelayAsync,
    sequenceAsync,
    sequenceIntervalAsync,
} from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async switchAll – switches to the latest inner', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield toDelayAsync([0, 1, 2, 3, 4], 30);   // slow
        yield toDelayAsync([10, 11, 12, 13], 20);  // cancels previous
        yield toDelayAsync([20, 21, 22], 15);      // final
    }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[result.length - 1]).toBeGreaterThanOrEqual(20);
});

test('async switchAll – empty outer', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> { }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );
    expect(result).toEqual([]);
});

test('async switchAll – single inner', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield sequenceAsync(0, 4);
    }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );
    expect(result).toEqual([0, 1, 2, 3]);
});

test('async switchAll – empty inners', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield sequenceAsync(0, 0);
        yield sequenceAsync(0, 0);
        yield sequenceAsync(10, 12);
    }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );
    expect(result).toEqual([10, 11]);
});

// ---------- Composition ----------

test('async switchAll – works with map', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield toDelayAsync([0, 1, 2], 20);
        yield toDelayAsync([10, 11, 12], 15);
    }

    const result = await collectAsync(
        pipeAsync(
            source(),
            switchAll(),
            map(x => x * 10)
        )
    );

    expect(result.every(v => v % 10 === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
});

// ---------- Switching behaviour ----------

test('async switchAll – rapid outer cancels previous inners', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield toDelayAsync([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 50); // long-running
        yield toDelayAsync([100, 101, 102], 10);
        yield toDelayAsync([200, 201, 202], 10);
    }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );

    const fromFirst = result.filter(v => v < 100);
    expect(fromFirst.length).toBeLessThan(3);
    expect(result.some(v => v >= 200)).toBe(true);
});

test('async switchAll – last inner runs to completion', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield toDelayAsync([0, 1, 2], 30);
        yield toDelayAsync([10, 11, 12, 13], 20);
    }

    const result = await collectAsync(
        pipeAsync(source(), switchAll())
    );

    expect(result).toContain(10);
    expect(result).toContain(11);
    expect(result).toContain(12);
    expect(result).toContain(13);
});