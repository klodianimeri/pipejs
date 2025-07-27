import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { skipLast } from '../src/pipes/skip-last';

test('sync skipLast', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), skipLast(2));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toEqual(1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async skipLast', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), skipLast(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual(1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});