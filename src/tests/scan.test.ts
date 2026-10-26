import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { scan } from '../pipes/scan.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

const add = (acc: number, x: number) => acc + x;
const concat = (acc: string, x: number) => acc + String(x);

// ---------- Sync – with seed ----------

test('sync scan – with seed, running sum', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        scan(add, 0)
    )];
    // 0+1=1, 1+2=3, 3+3=6, 6+4=10
    expect(result).toEqual([1, 3, 6, 10]);
});

test('sync scan – with seed, single element', () => {
    const result = [...pipeSync(
        [5],
        scan(add, 10)
    )];
    expect(result).toEqual([15]);
});

test('sync scan – with seed, empty source', () => {
    const result = [...pipeSync(
        [],
        scan(add, 42)
    )];
    // Seed is never emitted on its own; nothing from source
    expect(result).toEqual([]);
});

// ---------- Sync – without seed ----------

test('sync scan – without seed, first value is seed', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        scan(add)
    )];
    // first=1, 1+2=3, 3+3=6, 6+4=10
    expect(result).toEqual([1, 3, 6, 10]);
});

test('sync scan – without seed, single element', () => {
    const result = [...pipeSync(
        [7],
        scan(add)
    )];
    expect(result).toEqual([7]);
});

test('sync scan – without seed, empty source', () => {
    const result = [...pipeSync(
        [],
        scan(add)
    )];
    expect(result).toEqual([]);
});

// ---------- Index & composition ----------

test('sync scan – index is passed', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        [10, 20, 30],
        scan((acc, x, i) => {
            indexes.push(i);
            return acc + x;
        }, 0)
    )];
    expect(indexes).toEqual([0, 1, 2]);
    expect(result).toEqual([10, 30, 60]);
});

test('sync scan – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4),               // 1,2,3
        scan(add, 0),
        map(x => x * 10)
    )];
    expect(result).toEqual([10, 30, 60]);
});

test('sync scan – string accumulation', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        scan(concat, "")
    )];
    expect(result).toEqual(["1", "12", "123"]);
});

// ---------- Async ----------

test('async scan – with seed, running sum', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 5),            // 1,2,3,4
            scan(add, 0)
        )
    );
    expect(result).toEqual([1, 3, 6, 10]);
});

test('async scan – without seed', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4),            // 1,2,3
            scan(add)
        )
    );
    expect(result).toEqual([1, 3, 6]);
});

test('async scan – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            scan(add, 0)
        )
    );
    expect(result).toEqual([]);
});

test('async scan – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4),
            scan(add, 0),
            map(x => x * 10)
        )
    );
    expect(result).toEqual([10, 30, 60]);
});