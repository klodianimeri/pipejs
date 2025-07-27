import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { reverse } from '../src/pipes/reverse';

test('sync reverse', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), reverse());

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(3);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(2);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async reverse', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), reverse());

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(3);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(2);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});