// debounce-time.test.ts / debounce.test.ts
import { pipeAsync } from "../async/pipe-async.js";
import { debounceTime } from '../pipes/debounce-time.js';
// import { debounce } from '../pipes/debounce.js';
import { map } from '../pipes/map.js';
import { sequenceAsync, toDelayAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

/** emits values with gaps (ms) between them */
async function* timed<T>(items: T[], gapMs: number): AsyncIterable<T> {
    for (const item of items) {
        yield item;
        await delay(gapMs);
    }
}

// ---------- debounceTime ----------

test('async debounceTime – rapid values → only last', async () => {
    // values arrive ~20ms apart; debounce 100ms → only final value
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3, 4], 20),
            debounceTime(100)
        )
    );
    expect(result).toEqual([4]);
});

test('async debounceTime – gaps longer than dueTime → each value', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 150),
            debounceTime(50)
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async debounceTime – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            debounceTime(50)
        )
    );
    expect(result).toEqual([]);
});

test('async debounceTime – dueTime 0 passes through', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            debounceTime(0)
        )
    );
    expect(result).toEqual([0, 1, 2]);
});

test('async debounceTime – works after map', async () => {
    const result = await collectAsync(
        pipeAsync(
            timed([1, 2, 3], 20),
            map(x => x * 10),
            debounceTime(100)
        )
    );
    expect(result).toEqual([30]);
});