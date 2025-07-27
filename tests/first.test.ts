import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { first } from '../src/pipes/first';

test('sync first', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), first());

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async first', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), first());

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});