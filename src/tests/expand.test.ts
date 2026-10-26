import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { expand, expandAsync } from '../pipes/expand.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';
import { sequenceSync, sequenceAsync, sequenceIntervalAsync, toDelayAsync, toGeneratorAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync expand ----------

test('sync expand – simple recursion', () => {
    const result = [...pipeSync(
        [1],
        expand(x => x < 3 ? [x + 1] : [])
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync expand – branching', () => {
    const result = [...pipeSync(
        [1],
        expand(x => x < 3 ? [x + 1, x + 1] : [])
    )];
    // 1 → 2,2 → 3,3,3,3
    expect(result).toEqual([1, 2, 3, 3, 2, 3, 3]);
});

test('sync expand – empty projection stops', () => {
    const result = [...pipeSync(
        [10, 20],
        expand((x) => [])
    )];

    expect(result).toEqual([10, 20]);
});

test('sync expand – empty source', () => {
    const result = [...pipeSync(
        [],
        expand(x => [x, x])
    )];
    expect(result).toEqual([]);
});

test('sync expand – works with map', () => {
    const result = [...pipeSync(
        [1],
        expand(x => x < 2 ? [x + 1] : []),
        map(x => x * 10)
    )];
    expect(result).toEqual([10, 20]);
});

test('sync expand – index is passed', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        [1],
        expand((x, i) => {
            indexes.push(i);
            return x < 3 ? [x + 1] : [];
        })
    )];
    expect(result).toEqual([1, 2, 3]);
    expect(indexes).toEqual([0, 1, 2]);
});

// ---------- Async expand ----------

test('async expand – simple recursion', async () => {
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(1, 2, 10),
        expand(x => x < 3 ? [x + 1] : [])
    ));
    expect(result).toEqual([1, 2, 3]);
});

test('async expand – branching', async () => {
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(1, 2, 10),
        expand(x => x < 3 ? [x + 1, x + 1] : [])
    ));
    // 1 → 2,2 → 3,3,3,3
    expect(result).toEqual([1, 2, 3, 3, 2, 3, 3]);
});

test('async expand – empty projection stops', async () => {
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(10, 12, 10),
        expand((x) => [])
    ));

    expect(result).toEqual([10, 11]);
});

test('async expand – empty source', async () => {
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(0, 0, 0),
        expand(x => [x, x])
    ));

    expect(result).toEqual([]);
});

test('async expand – works with map', async () => {
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(1, 2, 10),
        expand(x => x < 2 ? [x + 1] : []),
        map(x => x * 10)
    ));

    expect(result).toEqual([10, 20]);
});

test('async expand – index is passed', async () => {
    const indexes: number[] = [];
    const result = await collectAsync(pipeAsync(
        sequenceIntervalAsync(1, 2, 10),
        expand((x, i) => {
            indexes.push(i);
            return x < 3 ? [x + 1] : [];
        })
    ));

    expect(result).toEqual([1, 2, 3]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('async expandAsync – simple recursion', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),                       // [1]
            expandAsync(async function* (x) {
                if (x < 3) yield x + 1;
            })
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async expandAsync – branching', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),
            expandAsync(async function* (x) {
                if (x < 3) {
                    yield x + 1;
                    yield x + 1;
                }
            })
        )
    );
    expect(result).toEqual([1, 2, 3, 3, 2, 3, 3]);
});

test('async expandAsync – empty projection stops', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 12),                     // 10, 11
            expandAsync(async function* (_x: number): AsyncIterable<number> {
                // empty – no yields
            })
        )
    );
    expect(result).toEqual([10, 11]);
});

test('async expandAsync – null/undefined projection stops', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(5, 7),
            expandAsync(() => undefined)
        )
    );
    expect(result).toEqual([5, 6]);
});

test('async expandAsync – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            expandAsync(async function* (x) {
                yield x;
            })
        )
    );
    expect(result).toEqual([]);
});

test('async expandAsync – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),
            expandAsync(async function* (x) {
                if (x < 2) yield x + 1;
            }),
            map(x => x * 10)
        )
    );
    expect(result).toEqual([10, 20]);
});

test('async expandAsync – index is passed', async () => {
    const indexes: number[] = [];

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),
            expandAsync(async function* (x, i) {
                indexes.push(i);
                if (x < 3) yield x + 1;
            })
        )
    );

    expect(result).toEqual([1, 2, 3]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('async expandAsync – project returns Promise of async iterable', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),
            expandAsync(async (x) => {
                if (x >= 3) return toGeneratorAsync([]);
                return toGeneratorAsync([x + 1]);
            })
        )
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async expandAsync – with delayed inner values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 1),                       // [0]
            expandAsync(async function* (x) {
                if (x < 2) {
                    yield* toDelayAsync([x + 1], 10);
                }
            })
        )
    );
    expect(result).toEqual([0, 1, 2]);
});