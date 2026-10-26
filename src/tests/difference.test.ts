import { pipeSync } from "../sync/pipe-sync.js";
import { difference } from '../pipes/difference.js';
import { map } from '../pipes/map.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync difference – two sources', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        difference([2, 4])
    )];
    expect(result).toEqual([1, 3, 5]);
});

test('sync difference – multiple sources (union of others)', () => {
    // A ∖ B ∖ C = A ∖ (B ∪ C)
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        difference([1, 2], [4, 6])
    )];
    expect(result).toEqual([3, 5]);
});

test('sync difference – no overlap (identity)', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        difference([4, 5, 6])
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync difference – other covers all', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        difference([1, 2, 3, 4])
    )];
    expect(result).toEqual([]);
});

test('sync difference – empty main source', () => {
    const result = [...pipeSync(
        [],
        difference([1, 2, 3])
    )];
    expect(result).toEqual([]);
});

test('sync difference – empty other source', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        difference([] as any)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync difference – no other sources', () => {
    const result = [...pipeSync(
        [1, 2, 2, 3],
        difference()
    )];
    // Still a set → duplicates removed
    expect(result).toEqual([1, 2, 3]);
});

// ---------- Set semantics ----------

test('sync difference – duplicates in main appear once', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2, 3, 3],
        difference([2])
    )];
    expect(result).toEqual([1, 3]);
});

test('sync difference – order is first occurrence in main', () => {
    const result = [...pipeSync(
        [5, 1, 3, 2, 1],
        difference([2])
    )];
    expect(result).toEqual([5, 1, 3]);
});

// ---------- Composition ----------

test('sync difference – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 6),               // 0..5
        difference([1, 3, 5]),
        map(x => x * 10)
    )];
    expect(result).toEqual([0, 20, 40]);
});

// ---------- Multiple sources ----------

test('sync difference – three others', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5, 6, 7],
        difference([1], [3, 4], [6])
    )];
    expect(result).toEqual([2, 5, 7]);
});