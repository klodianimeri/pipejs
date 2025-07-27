import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { mapTo } from '../src/pipes/map-to';

test('sync mapTo', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), mapTo('100'));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual('100');

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual('100');

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual('100');

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async mapTo', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), mapTo('100'));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual('100');

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual('100');

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual('100');

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});