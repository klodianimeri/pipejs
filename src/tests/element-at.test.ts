import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { elementAt } from '../pipes/element-at.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync elementAt – valid index', () => {
    const result = [...pipeSync(sequenceSync(0, 5), elementAt(2))];
    expect(result).toEqual([2]);
});

test('sync elementAt – first index', () => {
    const result = [...pipeSync(sequenceSync(0, 5), elementAt(0))];
    expect(result).toEqual([0]);
});

test('sync elementAt – last index', () => {
    const result = [...pipeSync(sequenceSync(0, 5), elementAt(4))];
    expect(result).toEqual([4]);
});

test('sync elementAt – out of range → empty', () => {
    const result = [...pipeSync(sequenceSync(0, 5), elementAt(30))];
    expect(result).toEqual([]);
});

test('sync elementAt – empty source → empty', () => {
    const result = [...pipeSync(sequenceSync(0, 0), elementAt(0))];
    expect(result).toEqual([]);
});

test('sync elementAt – negative index → empty', () => {
    const result = [...pipeSync(sequenceSync(0, 5), elementAt(-1))];
    expect(result).toEqual([]);
});

test('sync elementAt – negative emits only once', () => {
    const result = [...pipeSync(sequenceSync(0, 10), elementAt(-3))];
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
});

test('sync elementAt – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        elementAt(3)
    )];
    expect(result).toEqual([30]);
});

// ---------- Async ----------

test('async elementAt – valid index', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 5), elementAt(1))
    );
    expect(result).toEqual([1]);
});

test('async elementAt – out of range → empty', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 5), elementAt(30))
    );
    expect(result).toEqual([]);
});

test('async elementAt – empty → empty', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 0), elementAt(0))
    );
    expect(result).toEqual([]);
});

test('async elementAt – negative → empty', async () => {
    const result = await collectAsync(
        pipeAsync(sequenceAsync(0, 5), elementAt(-1))
    );
    expect(result).toEqual([]);
});