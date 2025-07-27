import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { difference } from '../src/pipes/difference';

test('sync difference', () => {
    let pipe = pipeSync(toGeneratorSync([3, 8, 5, 8, 5, 5, 5, 9, 7]), difference(toGeneratorSync([8, 9])));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(3);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(5);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(7);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async difference', async () => {
    let pipe = pipeAsync(toGeneratorAsync([3, 8, 5, 8, 5, 5, 5, 9, 7]), difference(toGeneratorSync([8, 9])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toBe(3);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toBe(5);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe(7);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});