import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { symmetricDifference } from '../src/pipes/symmetric-difference';

test('sync symmetricDifference', () => {
    let pipe = pipeSync(toGeneratorSync([8, 9]), symmetricDifference(toGeneratorSync([9, 10])));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(8);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(9);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(10);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async symmetricDifference', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 9]), symmetricDifference(toGeneratorSync([9, 10])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(8);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(9);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(10);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});