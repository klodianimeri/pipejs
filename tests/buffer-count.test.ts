import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { sequenceSync, sequenceAsync } from "./sequence.test";
import { bufferCount } from '../src/pipes/buffer-count';

test('sync bufferCount empty undefined', () => {
    let pipe = pipeSync(sequenceSync(0, 0), bufferCount(3));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBeUndefined();
});

test('sync bufferCount not empty', () => {
    let pipe = pipeSync(sequenceSync(0, 10), bufferCount(3));

    let results: Array<Array<number>> = new Array<Array<number>>();

    for (const element of pipe) {
        results.push(element);
    }

    expect(4).toBe(results.length);

    expect(results[0]).toEqual([0, 1, 2]);
    expect(results[1]).toEqual([3, 4, 5]);
    expect(results[2]).toEqual([6, 7, 8]);
    expect(results[3]).toEqual([9]);
});

test('sync bufferCount half', () => {
    let pipe = pipeSync(sequenceSync(0, 4), bufferCount(2));

    let results: Array<Array<number>> = new Array<Array<number>>();

    for (const element of pipe) {
        results.push(element);
    }

    expect(2).toBe(results.length);

    expect(results[0]).toEqual([0, 1]);
    expect(results[1]).toEqual([2, 3]);
});

test('async bufferCount empty undefined', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 0), bufferCount(3));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBeUndefined();
});

test('async bufferCount not empty', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 10), bufferCount(3));

    let results: Array<Array<number>> = new Array<Array<number>>();

    for await (const element of pipe) {
        results.push(element);
    }

    expect(4).toBe(results.length);

    expect(results[0]).toEqual([0, 1, 2]);
    expect(results[1]).toEqual([3, 4, 5]);
    expect(results[2]).toEqual([6, 7, 8]);
    expect(results[3]).toEqual([9]);
});

test('async bufferCount half', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 4), bufferCount(2));

    let results: Array<Array<number>> = new Array<Array<number>>();

    for await (const element of pipe) {
        results.push(element);
    }

    expect(2).toBe(results.length);

    expect(results[0]).toEqual([0, 1]);
    expect(results[1]).toEqual([2, 3]);
});