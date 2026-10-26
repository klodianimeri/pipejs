import { pipeSync } from "../sync/pipe-sync.js";
import { isDisjointFrom } from '../pipes/is-disjoint-from.js';
import { sequenceSync } from "./sequence.test.js";

// ---------- Basic behaviour ----------

test('sync isDisjointFrom – disjoint → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom([4, 5, 6])
    )];
    expect(result).toEqual([true]);
});

test('sync isDisjointFrom – overlap → false', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom([3, 4, 5])
    )];
    expect(result).toEqual([false]);
});

test('sync isDisjointFrom – overlap later in main', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        isDisjointFrom([5, 9])
    )];
    expect(result).toEqual([false]);
});

test('sync isDisjointFrom – multiple others (union)', () => {
    // Disjoint from each individually is not enough; union matters
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom([4, 5], [3, 6])  // 3 is in second → false
    )];
    expect(result).toEqual([false]);
});

test('sync isDisjointFrom – multiple others all disjoint', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom([4, 5], [6, 7])
    )];
    expect(result).toEqual([true]);
});

// ---------- Edge cases ----------

test('sync isDisjointFrom – empty main → true', () => {
    const result = [...pipeSync(
        [],
        isDisjointFrom([1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync isDisjointFrom – empty other → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom([])
    )];
    expect(result).toEqual([true]);
});

test('sync isDisjointFrom – no other sources → true', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isDisjointFrom()
    )];
    expect(result).toEqual([true]);
});

test('sync isDisjointFrom – identical sequences → false', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        isDisjointFrom(sequenceSync(0, 4))
    )];
    expect(result).toEqual([false]);
});

test('sync isDisjointFrom – single element overlap', () => {
    const result = [...pipeSync(
        [10, 20, 30],
        isDisjointFrom([0, 20, 40])
    )];
    expect(result).toEqual([false]);
});

test('sync isDisjointFrom – emits only one boolean', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        isDisjointFrom([9])
    )];
    expect(result).toEqual([true]);
    expect(result.length).toBe(1);
});