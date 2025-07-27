import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { sequenceSync, sequenceAsync } from "./sequence.test";
import { count } from '../src/pipes/count';

test('sync count empty', () => {
    let pipe = pipeSync(sequenceSync(0, 0), count());

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(0);
});

test('sync count', () => {
    let pipe = pipeSync(sequenceSync(0, 3), count());

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(3);
});

test('async count empty', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 0), count());

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(0);
});

test('async count', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 3), count());

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(3);
});