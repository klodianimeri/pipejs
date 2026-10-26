import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { concatWith, concatWithAsync } from '../pipes/concat-with.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceSync, sequenceAsync, sequenceIntervalAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync concatWith ----------

test('sync concatWith – appends one source', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),               // 0,1,2
        concatWith([10, 11, 12])
    )];
    expect(result).toEqual([0, 1, 2, 10, 11, 12]);
});

test('sync concatWith – appends multiple sources', () => {
    const result = [...pipeSync(
        sequenceSync(0, 2),               // 0,1
        concatWith([10, 11], [20], [30, 31])
    )];
    expect(result).toEqual([0, 1, 10, 11, 20, 30, 31]);
});

test('sync concatWith – empty main source', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        concatWith([5, 6, 7])
    )];
    expect(result).toEqual([5, 6, 7]);
});

test('sync concatWith – empty extra sources', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        concatWith([], [10], [])
    )];
    expect(result).toEqual([0, 1, 2, 10]);
});

test('sync concatWith – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 2),
        concatWith([10, 11]),
        map(x => x * 10)
    )];
    expect(result).toEqual([0, 10, 100, 110]);
});

// ---------- Async concatWithAsync ----------

test('async concatWithAsync – appends one source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            concatWithAsync(sequenceIntervalAsync(10, 13, 10))   // 10,11,12
        )
    );

    expect(result).toEqual([0, 1, 2, 10, 11, 12]);
});

test('async concatWithAsync – appends multiple sources', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 2),
            concatWithAsync(
                sequenceIntervalAsync(10, 12, 10),               // 10,11
                sequenceIntervalAsync(20, 21, 10),               // 20
                sequenceIntervalAsync(30, 32, 10)                // 30,31
            )
        )
    );
    expect(result).toEqual([0, 1, 10, 11, 20, 30, 31]);
});

test('async concatWithAsync – empty main source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            concatWithAsync(sequenceIntervalAsync(5, 8, 10))
        )
    );
    expect(result).toEqual([5, 6, 7]);
});

test('async concatWithAsync – empty extra sources', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            concatWithAsync(timer(5, 0), sequenceIntervalAsync(10, 11, 5), timer(5, 0))
        )
    );
    expect(result).toEqual([0, 1, 2, 10]);
});

test('async concatWithAsync – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 2),
            concatWithAsync(sequenceIntervalAsync(10, 12, 10)),
            map(x => x * 10)
        )
    );
    expect(result).toEqual([0, 10, 100, 110]);
});