import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { fill } from '../src/pipes/fill';

test('sync fill', () => {
    let pipe = pipeSync(toGeneratorSync([5, 6]), fill('name'));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe('name');

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual('name');

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async fill', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 6]), fill('name'));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe('name');

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe('name');

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});