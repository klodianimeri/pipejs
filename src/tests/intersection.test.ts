import { pipeSync } from "../sync/pipe-sync.js";
import { intersection } from '../pipes/intersection.js';
import { map } from '../pipes/map.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync intersection – two sources', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        intersection([2, 4, 6])
    )];
    expect(result).toEqual([2, 4]);
});

test('sync intersection – three sources (true multi-set)', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        intersection([1, 2, 3], [2, 3, 4])
    )];
    // Only values in ALL of: main, first, second
    expect(result).toEqual([2, 3]);
});

test('sync intersection – counterexample vs union-of-others', () => {
    // Main: 1,2,3,4  B: 1,2  C: 2,3
    // A ∩ (B ∪ C) would be [1,2,3]
    // A ∩ B ∩ C is [2]
    const result = [...pipeSync(
        [1, 2, 3, 4],
        intersection([1, 2], [2, 3])
    )];
    expect(result).toEqual([2]);
});

test('sync intersection – no overlap', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        intersection([4, 5, 6])
    )];
    expect(result).toEqual([]);
});

test('sync intersection – empty main source', () => {
    const result = [...pipeSync(
        [],
        intersection([1, 2, 3])
    )];
    expect(result).toEqual([]);
});

test('sync intersection – empty other source', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        intersection([] as any)
    )];
    expect(result).toEqual([]);
});

test('sync intersection – no other sources (identity)', () => {
    const result = [...pipeSync(
        [1, 2, 2, 3],
        intersection()
    )];
    // Nothing to intersect with → all unique main values
    expect(result).toEqual([1, 2, 3]);
});

// ---------- Set semantics ----------

test('sync intersection – duplicates in main appear once', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2, 3],
        intersection([1, 2, 4])
    )];
    expect(result).toEqual([1, 2]);
});

test('sync intersection – order is first occurrence in main', () => {
    const result = [...pipeSync(
        [5, 1, 3, 2, 1],
        intersection([1, 2, 3, 5])
    )];
    expect(result).toEqual([5, 1, 3, 2]);
});

// ---------- Composition ----------

test('sync intersection – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),               // 0..5
        intersection([1, 2, 3, 9]),
        map(x => x * 10)
    )];
    expect(result).toEqual([10, 20, 30]);
});

// ---------- Multiple sources ----------

test('sync intersection – four sources', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5, 6],
        intersection(
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
        )
    )];
    expect(result).toEqual([3, 4]);
});