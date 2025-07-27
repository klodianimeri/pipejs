import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { ignoreElements } from '../src/pipes/ignore-elements';

test('sync ignoreElements', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), ignoreElements());

    let iterator = pipe[Symbol.iterator]();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async ignoreElements', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), ignoreElements());

    let iterator = pipe[Symbol.asyncIterator]();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});