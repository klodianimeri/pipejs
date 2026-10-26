import { pipeAsync } from "../async/pipe-async.js";
import { timeout } from '../pipes/timeout.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceAsync } from "./sequence.test.js";
import { delayEach } from '../pipes/delay-each.js';

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Basic behaviour ----------

test('async timeout – passes values when gaps are within the limit', async () => {
    const pipe = pipeAsync(
        timer(30, 5),                     // every 30 ms
        timeout(100)                      // allow up to 100 ms gaps
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('async timeout – throws when a gap is too large', async () => {
    const pipe = pipeAsync(
        timer(80, 4),                     // every 80 ms
        timeout(50)                       // only allow 50 ms gaps
    );

    await expect(collectAsync(pipe)).rejects.toThrow('TimeoutError');
});

test('async timeout – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        timeout(50)
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([]);
});

test('async timeout – single value never times out', async () => {
    const pipe = pipeAsync(
        sequenceAsync(42, 43),
        timeout(10)
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([42]);
});

// ---------- Composition ----------

test('async timeout – works with map', async () => {
    const pipe = pipeAsync(
        timer(20, 4),
        timeout(100),
        map(x => x * 10)
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([0, 10, 20, 30]);
});

// ---------- Edge cases ----------

test('async timeout – rapid synchronous source never times out', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 6),
        timeout(5)                        // very small interval
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
});

test('async timeout – with delayEach that exceeds the limit', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        delayEach(60),
        timeout(40)
    );

    await expect(collectAsync(pipe)).rejects.toThrow('TimeoutError');
});

test('async timeout – with delayEach that stays under the limit', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        delayEach(30),
        timeout(80)
    );

    const result = await collectAsync(pipe);
    expect(result).toEqual([0, 1, 2, 3]);
});

test('async timeout – first value can timout', async () => {
    const pipe = pipeAsync(
        timer(100, 1),
        timeout(10)
    );

    await expect(collectAsync(pipe)).rejects.toThrow('TimeoutError');
});