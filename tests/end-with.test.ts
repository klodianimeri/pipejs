import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { endWith } from '../src/pipes/end-with';

test('sync endwith', () => {
    let pipe = pipeSync(toGeneratorSync([5, 5]), endWith(10, 11));

    let iterator = pipe[Symbol.iterator]();

    iterator.next();
    iterator.next();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(10);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toBe(11);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async endwith', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 5]), endWith(10, 11));

    let iterator = pipe[Symbol.asyncIterator]();

    await iterator.next();
    await iterator.next();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(10);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe(11);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});