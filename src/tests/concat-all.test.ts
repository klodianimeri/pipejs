import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { concatAll, concatAllAsync } from '../pipes/concat-all.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync concatAll ----------

test('sync concatAll – flattens inner iterables', () => {
    const source = [
        [0, 1],
        [2, 3, 4],
        [5],
    ];

    const result = [...pipeSync(source, concatAll())];
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
});

test('sync concatAll – empty outer', () => {
    const result = [...pipeSync([], concatAll())];
    expect(result).toEqual([]);
});

test('sync concatAll – empty inners', () => {
    const source = [[], [1, 2], [], [3]];
    const result = [...pipeSync(source, concatAll())];
    expect(result).toEqual([1, 2, 3]);
});

test('sync concatAll – works with map', () => {
    const source = [[1, 2], [3]];
    const result = [...pipeSync(
        source,
        concatAll(),
        map(x => x * 10)
    )];
    expect(result).toEqual([10, 20, 30]);
});

// ---------- Async concatAll ----------

test('async concatAll – flattens inner async iterables', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(10, 2);
        yield timer(10, 3);
        yield timer(10, 1);
    }

    const result = await collectAsync(
        pipeAsync(source(), concatAllAsync())
    );

    expect(result).toEqual([0, 1, 0, 1, 2, 0]);
});

test('async concatAll – empty outer', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {

    }

    const result = await collectAsync(
        pipeAsync(source(), concatAll())
    );
    expect(result).toEqual([]);
});

test('async concatAll – empty inners', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(5, 0);
        yield timer(5, 2);
        yield timer(5, 0);
        yield timer(5, 1);
    }

    const result = await collectAsync(
        pipeAsync(source(), concatAllAsync())
    );

    expect(result).toEqual([0, 1, 0]);
});

test('async concatAll – works with map', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(10, 2);
        yield timer(10, 1);
    }

    const result = await collectAsync(
        pipeAsync(
            source(),
            concatAllAsync(),
            map(x => x * 10)
        )
    );

    expect(result).toEqual([0, 10, 0]);
});