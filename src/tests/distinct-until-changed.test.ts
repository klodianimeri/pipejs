import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { distinctUntilChanged } from '../pipes/distinct-until-changed.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync distinctUntilChanged – removes consecutive duplicates', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2, 2, 3, 1],
        distinctUntilChanged()
    )];
    expect(result).toEqual([1, 2, 3, 1]);
});

test('sync distinctUntilChanged – all unique', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        distinctUntilChanged()
    )];
    expect(result).toEqual([1, 2, 3, 4]);
});

test('sync distinctUntilChanged – all same', () => {
    const result = [...pipeSync(
        [7, 7, 7, 7],
        distinctUntilChanged()
    )];
    expect(result).toEqual([7]);
});

test('sync distinctUntilChanged – empty source', () => {
    const result = [...pipeSync(
        [],
        distinctUntilChanged()
    )];
    expect(result).toEqual([]);
});

test('sync distinctUntilChanged – single value', () => {
    const result = [...pipeSync(
        [42],
        distinctUntilChanged()
    )];
    expect(result).toEqual([42]);
});

test('sync distinctUntilChanged – custom comparator', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 1, name: "b" },
            { id: 2, name: "c" },
        ],
        distinctUntilChanged((a, b) => a.id === b.id)
    )];
    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "c" },
    ]);
});

test('sync distinctUntilChanged – comparator uses absolute equality', () => {
    const result = [...pipeSync(
        [1, -1, 2, -2, 3],
        distinctUntilChanged((a, b) => Math.abs(a) === Math.abs(b))
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync distinctUntilChanged – works with map', () => {
    const result = [...pipeSync(
        [1, 2, 2, 3],
        map(x => x * 10),
        distinctUntilChanged()
    )];
    expect(result).toEqual([10, 20, 30]);
});

test('sync distinctUntilChanged – non-consecutive duplicates kept', () => {
    const result = [...pipeSync(
        [1, 2, 1, 2],
        distinctUntilChanged()
    )];
    expect(result).toEqual([1, 2, 1, 2]);
});

// ---------- Async ----------

test('async distinctUntilChanged – basic', async () => {
    async function* source() {
        yield 1; yield 1; yield 2; yield 2; yield 3;
    }

    const result = await collectAsync(
        pipeAsync(source(), distinctUntilChanged())
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async distinctUntilChanged – empty', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 0), distinctUntilChanged())
    );
    expect(result).toEqual([]);
});

test('async distinctUntilChanged – custom comparator', async () => {
    async function* source() {
        yield "a"; yield "A"; yield "b";
    }

    const result = await collectAsync(
        pipeAsync(
            source(),
            distinctUntilChanged((a, b) => a.toLowerCase() === b.toLowerCase())
        )
    );
    expect(result).toEqual(["a", "b"]);
});

test('async distinctUntilChanged – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4),            // 1,2,3
            map(x => Math.floor(x / 2)),  // 0,1,1
            distinctUntilChanged()
        )
    );
    expect(result).toEqual([0, 1]);
});