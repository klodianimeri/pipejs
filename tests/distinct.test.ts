import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { distinct } from '../src/pipes/distinct';

test('sync distinct', () => {
    let pipe = pipeSync(toGeneratorSync([5, 5, 6, 5]), distinct());

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toBe(5);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toBe(6);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toBeUndefined();
});

test('async distinct', async () => {
    let pipe = pipeAsync(toGeneratorAsync([5, 5, 6, 5]), distinct());

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toBe(5);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toBe(6);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBeUndefined();
});