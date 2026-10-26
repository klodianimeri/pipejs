import { pipeSync } from "../sync/pipe-sync.js";
import { union } from '../pipes/union.js';
import { map } from '../pipes/map.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync union – two sources', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        union([3, 4, 5])
    )];
    expect(result).toEqual([1, 2, 3, 4, 5]);
});

test('sync union – multiple sources', () => {
    const result = [...pipeSync(
        [1, 2],
        union([2, 3], [3, 4], [5])
    )];
    expect(result).toEqual([1, 2, 3, 4, 5]);
});

test('sync union – disjoint', () => {
    const result = [...pipeSync(
        [1, 2],
        union([3, 4])
    )];
    expect(result).toEqual([1, 2, 3, 4]);
});

test('sync union – other fully covered by main', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        union([2, 3])
    )];
    expect(result).toEqual([1, 2, 3, 4]);
});

// ---------- Set semantics ----------

test('sync union – duplicates in main appear once', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2, 3],
        union([3, 4])
    )];
    expect(result).toEqual([1, 2, 3, 4]);
});

test('sync union – duplicates in other appear once', () => {
    const result = [...pipeSync(
        [1],
        union([2, 2, 2, 3, 3])
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync union – duplicates across others appear once', () => {
    const result = [...pipeSync(
        [1],
        union([2, 3], [2, 4], [3, 5])
    )];
    expect(result).toEqual([1, 2, 3, 4, 5]);
});

// ---------- Edge cases ----------

test('sync union – empty main', () => {
    const result = [...pipeSync(
        [],
        union([1, 2, 3])
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync union – empty other', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        union([] as any)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync union – no other sources', () => {
    const result = [...pipeSync(
        [1, 1, 2, 3, 3],
        union()
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync union – both empty', () => {
    const result = [...pipeSync(
        [],
        union([])
    )];
    expect(result).toEqual([]);
});

// ---------- Composition ----------

test('sync union – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),               // 0,1,2
        union([2, 3, 4]),
        map(x => x * 10)
    )];
    expect(result).toEqual([0, 10, 20, 30, 40]);
});

test('sync union – order is main first, then others', () => {
    const result = [...pipeSync(
        [5, 1],
        union([1, 3, 2])
    )];
    expect(result).toEqual([5, 1, 3, 2]);
});