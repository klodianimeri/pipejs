import { pipeSync } from "../sync/pipe-sync.js";
import { isSupersetOf } from '../pipes/is-superset-of.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync isSupersetOf – proper superset → true', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        isSupersetOf([1, 2])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – equal sets → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isSupersetOf([1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – not a superset → false', () => {
    const result = [...pipeSync(
        [1, 2],
        isSupersetOf([1, 2, 3])
    )];
    expect(result).toEqual([false]);
});

test('sync isSupersetOf – early true when all covered', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        isSupersetOf([2, 4])
    )];
    // Can complete as soon as 2 and 4 have been seen
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – multiple others (union must be covered)', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        isSupersetOf([1, 2], [4])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – multiple others missing one → false', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isSupersetOf([1, 2], [4])
    )];
    expect(result).toEqual([false]);
});

// ---------- Edge cases ----------

test('sync isSupersetOf – empty other → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isSupersetOf([])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – no other sources → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isSupersetOf()
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – empty main, non-empty other → false', () => {
    const result = [...pipeSync(
        [],
        isSupersetOf([1, 2])
    )];
    expect(result).toEqual([false]);
});

test('sync isSupersetOf – both empty → true', () => {
    const result = [...pipeSync(
        [],
        isSupersetOf([])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – duplicates in main still cover', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2, 3],
        isSupersetOf([1, 2])
    )];
    expect(result).toEqual([true]);
});

test('sync isSupersetOf – emits only one boolean', () => {
    const result = [...pipeSync(
        sequenceSync(0, 10),
        isSupersetOf([1, 5, 9])
    )];
    expect(result).toEqual([true]);
    expect(result.length).toBe(1);
});