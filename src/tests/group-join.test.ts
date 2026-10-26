import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { groupJoin } from '../pipes/group-join.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync groupJoin – basic join', () => {
    const outer = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
    ];
    const inner = [
        { oid: 1, val: 10 },
        { oid: 1, val: 11 },
        { oid: 2, val: 20 },
    ];
    const result = [...pipeSync(
        outer,
        groupJoin(
            inner,
            o => o.id,
            i => i.oid,
            (o, ins) => ({ name: o.name, vals: [...ins].map(x => x.val) })
        )
    )];
    expect(result).toEqual([
        { name: 'a', vals: [10, 11] },
        { name: 'b', vals: [20] },
    ]);
});

test('sync groupJoin – no matches → empty inner group', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        groupJoin(
            [10, 20],
            o => o,
            i => i,
            (o, ins) => ({ o, count: [...ins].length })
        )
    )];
    expect(result).toEqual([
        { o: 1, count: 0 },
        { o: 2, count: 0 },
        { o: 3, count: 0 },
    ]);
});

test('sync groupJoin – empty outer', () => {
    const result = [...pipeSync(
        [] as number[],
        groupJoin(
            [1, 2],
            o => o,
            i => i,
            (o, ins) => o
        )
    )];
    expect(result).toEqual([]);
});

test('sync groupJoin – empty inner', () => {
    const result = [...pipeSync(
        [1, 2],
        groupJoin(
            [] as number[],
            o => o,
            i => i,
            (o, ins) => ({ o, n: [...ins].length })
        )
    )];
    expect(result).toEqual([
        { o: 1, n: 0 },
        { o: 2, n: 0 },
    ]);
});

test('sync groupJoin – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        groupJoin(
            [0, 10, 10, 20],
            o => o,
            i => i,
            (o, ins) => ({ o, count: [...ins].length })
        )
    )];
    expect(result).toEqual([
        { o: 0, count: 1 },
        { o: 10, count: 2 },
        { o: 20, count: 1 },
    ]);
});

// ---------- Async (outer async, inner sync) ----------

test('async groupJoin – basic join', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            groupJoin(
                [0, 0, 1, 2],
                o => o,
                i => i,
                (o, ins) => ({ o, count: [...ins].length })
            )
        )
    );
    expect(result).toEqual([
        { o: 0, count: 2 },
        { o: 1, count: 1 },
        { o: 2, count: 1 },
    ]);
});

test('async groupJoin – empty outer', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            groupJoin(
                [1, 2],
                o => o,
                i => i,
                (o) => o
            )
        )
    );
    expect(result).toEqual([]);
});