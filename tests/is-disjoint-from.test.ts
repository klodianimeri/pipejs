import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { isDisjointFrom } from '../src/pipes/is-disjoint-from'

test('sync isDisjointFrom', () => {
    let pipe = pipeSync(toGeneratorSync([8, 9, 7]), isDisjointFrom(toGeneratorSync([3, 5, 6])));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync isDisjointFrom false', () => {
    let pipe = pipeSync(toGeneratorSync([8, 9, 7]), isDisjointFrom(toGeneratorSync([8, 9, 10])));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isDisjointFrom', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 9, 7]), isDisjointFrom(toGeneratorSync([3, 5, 6])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isDisjointFrom false', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 9, 7]), isDisjointFrom(toGeneratorSync([8, 9, 10])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});