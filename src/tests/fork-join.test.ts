import { pipeAsync } from "../async/pipe-async.js";
import { forkJoin } from '../pipes/fork-join.js';
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

test('async forkJoin – emits last values when all complete', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),                          // 0,1,2
        forkJoin(
            sequenceAsync(10, 13),                    // 10,11,12
            sequenceAsync(20, 22)                     // 20,21
        )
    );

    const result = await collectAsync(pipe);

    // Should emit a single array with the last value of each source
    expect(result.length).toBe(1);
    expect(result[0]).toEqual([2, 12, 21]);
});

test('async forkJoin – single secondary source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(5, 8),                          // 5,6,7
        forkJoin(sequenceAsync(100, 103))             // 100,101,102
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual([7, 102]);
});

test('async forkJoin – empty main source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        forkJoin(sequenceAsync(10, 13))
    );

    const result = await collectAsync(pipe);
    // No emission because main source never produced a value
    expect(result).toEqual([]);
});

test('async forkJoin – empty secondary source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        forkJoin(sequenceAsync(0, 0))
    );

    const result = await collectAsync(pipe);
    // Secondary never produced a value → no emission
    expect(result).toEqual([]);
});

// ---------- Timing / delayed sources ----------

test('async forkJoin – works with delayed sources', async () => {
    const pipe = pipeAsync(
        toDelayAsync([1, 2, 3], 20),
        forkJoin(
            toDelayAsync([10, 11], 30),
            toDelayAsync([20, 21, 22], 15)
        )
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual([3, 11, 22]);
});

// ---------- Composition ----------

test('async forkJoin – works with map', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 3),
        forkJoin(sequenceAsync(10, 12)),
        map((arr: number[]) => arr.map(x => x * 10))
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual([20, 110]);
});

// ---------- Edge cases ----------

test('async forkJoin – multiple secondaries', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 2),                          // 0,1
        forkJoin(
            sequenceAsync(10, 12),                    // 10,11
            sequenceAsync(20, 23),                    // 20,21,22
            sequenceAsync(30, 31)                     // 30
        )
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual([1, 11, 22, 30]);
});

test('async forkJoin – source that emits only one value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(42, 43),                        // [42]
        forkJoin(sequenceAsync(99, 100))              // [99]
    );

    const result = await collectAsync(pipe);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual([42, 99]);
});