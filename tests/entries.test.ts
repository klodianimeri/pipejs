import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { entries } from '../src/pipes/entries';

test('sync entries', () => {
    let pipe = pipeSync(toGeneratorSync([5, 6]), entries());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toEqual([0, 5]);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual([1, 6]);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async entries', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 6]), entries());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual([0, 5]);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual([1, 6]);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});