import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { sequenceSync, sequenceAsync } from "./sequence.test";
import { defaultIfEmpty } from '../src/pipes/default-if-empty';

test('sync defaultIfEmpty empty', () => {
    let pipe = pipeSync(sequenceSync(0, 0), defaultIfEmpty('default'));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe('default');
});

test('sync defaultIfEmpty', () => {
    let pipe = pipeSync(sequenceSync(0, 1), defaultIfEmpty('default'));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(0);
});

test('async defaultIfEmpty empty', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 0), defaultIfEmpty('default'));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe('default');
});

test('async defaultIfEmpty', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 1), defaultIfEmpty('default'));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(0);
});