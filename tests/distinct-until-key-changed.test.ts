import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { distinctUntilKeyChanged } from '../src/pipes/distinct-until-key-changed';

test('sync distinctUntilChanged', () => {
    let pipe = pipeSync(toGeneratorSync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), distinctUntilKeyChanged('a'));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual({ a: 5 });

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual({ a: 6 });

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual({ a: 5 });

    let item3: IteratorResult<any> = iterator.next();

    expect(item3.value).toBeUndefined();
});

test('async distinctUntilChanged', async () => {
    let pipe = pipeAsync(toGeneratorAsync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), distinctUntilKeyChanged('a'));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual({ a: 5 });

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual({ a: 6 });

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual({ a: 5 });

    let item3: IteratorResult<any> = await iterator.next();

    expect(item3.value).toBeUndefined();
});