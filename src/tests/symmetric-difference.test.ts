import { pipeSync } from "../sync/pipe-sync.js";
import { symmetricDifference } from '../pipes/symmetric-difference.js';
import { map } from '../pipes/map.js';

// ---------- Basic behaviour ----------

test('sync symmetricDifference – two sets', () => {
    // {1,2,3} △ {2,3,4} = {1,4}
    const result = [...pipeSync(
        [1, 2, 3],
        symmetricDifference([2, 3, 4])
    )];
    expect(result.sort()).toEqual([1, 4]);
});

test('sync symmetricDifference – equal sets → empty', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        symmetricDifference([1, 2, 3])
    )];
    expect(result).toEqual([]);
});

test('sync symmetricDifference – disjoint sets → union', () => {
    const result = [...pipeSync(
        [1, 2],
        symmetricDifference([3, 4])
    )];
    expect(result.sort()).toEqual([1, 2, 3, 4]);
});

test('sync symmetricDifference – three sets', () => {
    // {1,2} △ {2,3} △ {3,4}
    // 1: once, 2: twice, 3: twice, 4: once → {1,4}
    const result = [...pipeSync(
        [1, 2],
        symmetricDifference([2, 3], [3, 4])
    )];
    expect(result.sort()).toEqual([1, 4]);
});

test('sync symmetricDifference – empty other', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        symmetricDifference([] as any)
    )];
    expect(result.sort()).toEqual([1, 2, 3]);
});

test('sync symmetricDifference – empty main', () => {
    const result = [...pipeSync(
        [],
        symmetricDifference([1, 2, 3])
    )];
    expect(result.sort()).toEqual([1, 2, 3]);
});

test('sync symmetricDifference – both empty', () => {
    const result = [...pipeSync(
        [],
        symmetricDifference([])
    )];
    expect(result).toEqual([]);
});

test('sync symmetricDifference – duplicates in main count once', () => {
    const result = [...pipeSync(
        [1, 1, 2, 2],
        symmetricDifference([2, 3])
    )];
    // {1,2} △ {2,3} = {1,3}
    expect(result.sort()).toEqual([1, 3]);
});

test('sync symmetricDifference – duplicates in other count once', () => {
    const result = [...pipeSync(
        [1, 2],
        symmetricDifference([2, 2, 3, 3])
    )];
    expect(result.sort()).toEqual([1, 3]);
});

test('sync symmetricDifference – works with map', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        symmetricDifference([2, 4]),
        map(x => x * 10)
    )];
    expect(result.sort()).toEqual([10, 30, 40]);
});