import { pipeAsync } from "../async/pipe-async.js";
import { debounce } from '../pipes/debounce.js';
import { map } from '../pipes/map.js';
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

// ---------- Async ----------

test('async debounce – rapid values → only last', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3, 4], 20),
            debounce(() => 100)
        )
    );
    expect(result).toEqual([4]);
});

test('async debounce – gaps longer than notifier → each value', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 150),
            debounce(() => 50)
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async debounce – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            debounce(() => 50)
        )
    );
    expect(result).toEqual([]);
});

test('async debounce – immediate notifier passes through on next/DONE', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 30),
            debounce(() => 0)
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async debounce – per-value notifier duration', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 20),
            debounce(v => (v === 3 ? 30 : 200))
        )
    );
    expect(result).toEqual([3]);
});

test('async debounce – works after map', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 20),
            map(x => x * 10),
            debounce(() => 100)
        )
    );
    expect(result).toEqual([30]);
});

test('async debounce – single value', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([42], 0),
            debounce(() => 30)
        )
    );
    expect(result).toEqual([42]);
});