import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { keys } from '../src/pipes/keys';

test('sync keys', () => {
    let pipe = pipeSync(toGeneratorSync([8, 8, 8]), keys());

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(0);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(1);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(2);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async keys', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 8, 8]), keys());

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(0);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(1);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(2);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});