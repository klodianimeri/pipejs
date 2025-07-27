import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { startWith } from '../src/pipes/start-with';

test('sync startWith', () => {
    let pipe = pipeSync(toGeneratorSync([5, 5]), startWith(10, 11));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(10);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toBe(11);

    iterator.next();
    iterator.next();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async startWith', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 5]), startWith(10, 11));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(10);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe(11);

    await iterator.next();
    await iterator.next();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});