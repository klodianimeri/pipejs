import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { distinctUntilChanged } from '../src/pipes/distinct-until-changed';

test('sync distinctUntilChanged', () => {
    let pipe = pipeSync(toGeneratorSync([5, 5, 6, 5]), distinctUntilChanged());

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toBe(5);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toBe(6);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toBe(5);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async distinctUntilChanged', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 5, 6, 5]), distinctUntilChanged());

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toBe(5);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toBe(6);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe(5);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});