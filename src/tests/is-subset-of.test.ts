import { pipeSync } from "../sync/pipe-sync.js";
import { isSubsetOf } from '../pipes/is-subset-of.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync isSubsetOf – proper subset → true', () => {
    const result = [...pipeSync(
        [1, 2],
        isSubsetOf([1, 2, 3, 4])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – equal sets → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isSubsetOf([1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – not a subset → false', () => {
    const result = [...pipeSync(
        [1, 2, 5],
        isSubsetOf([1, 2, 3, 4])
    )];
    expect(result).toEqual([false]);
});

test('sync isSubsetOf – failure on first element', () => {
    const result = [...pipeSync(
        [9, 1, 2],
        isSubsetOf([1, 2, 3])
    )];
    expect(result).toEqual([false]);
});

test('sync isSubsetOf – multiple others (union)', () => {
    // main ⊆ (B ∪ C)
    const result = [...pipeSync(
        [1, 3],
        isSubsetOf([1, 2], [3, 4])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – multiple others missing value', () => {
    const result = [...pipeSync(
        [1, 2, 5],
        isSubsetOf([1, 2], [3, 4])  // 5 not in union
    )];
    expect(result).toEqual([false]);
});

// ---------- Edge cases ----------

test('sync isSubsetOf – empty main → true', () => {
    const result = [...pipeSync(
        [],
        isSubsetOf([1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – empty other, non-empty main → false', () => {
    const result = [...pipeSync(
        [1],
        isSubsetOf([])
    )];
    expect(result).toEqual([false]);
});

test('sync isSubsetOf – both empty → true', () => {
    const result = [...pipeSync(
        [],
        isSubsetOf([])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – no other sources, non-empty main → false', () => {
    const result = [...pipeSync(
        [1, 2],
        isSubsetOf()
    )];
    expect(result).toEqual([false]);
});

test('sync isSubsetOf – no other sources, empty main → true', () => {
    const result = [...pipeSync(
        [],
        isSubsetOf()
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – duplicates in main still subset', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2],
        isSubsetOf([1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync isSubsetOf – emits only one boolean', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        isSubsetOf(sequenceSync(0, 10))
    )];
    expect(result).toEqual([true]);
    expect(result.length).toBe(1);
});