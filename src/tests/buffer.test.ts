import { pipeAsync } from "../async/pipe-async.js";
import { buffer } from '../pipes/buffer.js';
import { timer } from '../util/timer.js';          // the generator we created
import { map } from '../pipes/map.js';

// Helper – collect all values from an async iterable
async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

test('async buffer – emits buffer when notifier fires', async () => {
    // Source emits every 30 ms, notifier every 100 ms
    const source = timer(30, 10);               // 0..9
    const notifier = timer(100, 5);             // fires 5 times

    const pipe = pipeAsync(
        source,
        buffer(notifier)
    );

    const result = await collect(pipe);

    // We expect several arrays, each containing the values that arrived
    // between notifier ticks
    expect(result.length).toBeGreaterThan(1);
    expect(result.every(Array.isArray)).toBe(true);

    // Flattened values should be 0..9 (order preserved)
    const flat = result.reduce((acc, val) => acc.concat(val), []);
    expect(flat).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('async buffer – flushes remaining items on completion', async () => {
    const source = timer(20, 5);                // 0..4
    const notifier = timer(1000, 1);            // fires very late (or never)

    const pipe = pipeAsync(
        source,
        buffer(notifier)
    );

    const result = await collect(pipe);

    // Because notifier is slow, everything should be flushed as one final buffer
    expect(result.length).toBe(1);
    expect(result[0]).toEqual([0, 1, 2, 3, 4]);
});

test('async buffer – empty source', async () => {
    const pipe = pipeAsync(
        timer(10, 0),                           // empty
        buffer(timer(50, 3))
    );

    const result = await collect(pipe);
    expect(result).toEqual([]);
});

test('async buffer – works with map after buffering', async () => {
    const source = timer(25, 6);
    const notifier = timer(80, 4);

    const pipe = pipeAsync(
        source,
        buffer(notifier),
        map((buf: number[]) => buf.map(x => x * 10))
    );

    const result = await collect(pipe);

    expect(result.every(Array.isArray)).toBe(true);
    const flat = result.reduce((acc, val) => acc.concat(val), []);
    expect(flat).toEqual([0, 10, 20, 30, 40, 50]);
});

test('async buffer – notifier finishes before source', async () => {
    const source = timer(30, 8);
    const notifier = timer(40, 2);              // only two emissions

    const pipe = pipeAsync(
        source,
        buffer(notifier)
    );

    const result = await collect(pipe);

    // Some buffers from the notifier + final flush
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.reduce((acc, val) => acc.concat(val), [])).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
});