import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { scan } from '../src/pipes/scan';

test('sync scan', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), scan((s, x) => s + x, 0));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(3);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async scan', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), scan((s, x) => s + x, 0));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(3);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});