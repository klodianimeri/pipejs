import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { findIndex } from '../src/pipes/find-index';

test('sync findIndex', () => {
    let pipe = pipeSync(toGeneratorSync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), findIndex(x => x.a === 6));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(2);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async findIndex', async () => {
    let pipe = pipeAsync(toGeneratorAsync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), findIndex(x => x.a === 6));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(2);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});