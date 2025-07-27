import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { reduce } from '../src/pipes/reduce';

test('sync take', () => {
    let pipe = pipeSync(toGeneratorSync([0, 1, 2, 3]), reduce((s, x) => s + x, 0));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async take', async () => {
    let pipe = pipeAsync(toGeneratorAsync([0, 1, 2, 3]), reduce((s, x) => s + x, 0));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});