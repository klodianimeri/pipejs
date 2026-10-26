import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { distinct } from '../pipes/distinct.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync distinct – removes duplicates', () => {
    const result = [...pipeSync(
        [1, 2, 2, 3, 1, 4, 3],
        distinct()
    )];
    expect(result).toEqual([1, 2, 3, 4]);
});

test('sync distinct – all unique', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        distinct()
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync distinct – all same', () => {
    const result = [...pipeSync(
        [5, 5, 5, 5],
        distinct()
    )];
    expect(result).toEqual([5]);
});

test('sync distinct – empty source', () => {
    const result = [...pipeSync(
        [],
        distinct()
    )];
    expect(result).toEqual([]);
});

test('sync distinct – single value', () => {
    const result = [...pipeSync(
        [9],
        distinct()
    )];
    expect(result).toEqual([9]);
});

test('sync distinct – keeps first occurrence order', () => {
    const result = [...pipeSync(
        [3, 1, 2, 1, 3, 2],
        distinct()
    )];
    expect(result).toEqual([3, 1, 2]);
});

test('sync distinct – with keySelector', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 1, name: "c" },
            { id: 3, name: "d" },
        ],
        distinct(x => x.id)
    )];
    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 3, name: "d" },
    ]);
});

test('sync distinct – keySelector strings', () => {
    const result = [...pipeSync(
        ["Apple", "apricot", "Banana", "apple"],
        distinct(x => x.toLowerCase())
    )];
    // "Apple" and "apple" share key "apple" → second dropped
    expect(result).toEqual(["Apple", "apricot", "Banana"]);
});

test('sync distinct – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),               // 0..5
        map(x => x % 3),                  // 0,1,2,0,1,2
        distinct()
    )];
    expect(result).toEqual([0, 1, 2]);
});

// ---------- Async ----------

test('async distinct – removes duplicates', async () => {
    async function* source() {
        yield 1; yield 2; yield 2; yield 3; yield 1;
    }

    const result = await collectAsync(
        pipeAsync(source(), distinct())
    );
    expect(result).toEqual([1, 2, 3]);
});

test('async distinct – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 0), distinct())
    );
    expect(result).toEqual([]);
});

test('async distinct – with keySelector', async () => {
    async function* source() {
        yield { id: 1 }; yield { id: 2 }; yield { id: 1 };
    }

    const result = await collectAsync(
        pipeAsync(source(), distinct(x => x.id))
    );
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
});

test('async distinct – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            map(x => x % 3),
            distinct()
        )
    );
    expect(result).toEqual([0, 1, 2]);
});