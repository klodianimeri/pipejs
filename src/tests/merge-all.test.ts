import { pipeAsync } from "../async/pipe-async.js";
import { mergeAll } from '../pipes/merge-all.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

test('async mergeAll – flattens inner async iterables', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(10, 2);          // 0,1
        yield timer(10, 3);          // 0,1,2
        yield timer(10, 1);          // 0
    }

    const result = await collectAsync(
        pipeAsync(source(), mergeAll())
    );


    expect(result).toEqual([0, 0, 0, 1, 1, 2]);
});

test('async mergeAll – empty outer', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> { }

    const result = await collectAsync(
        pipeAsync(source(), mergeAll())
    );
    expect(result).toEqual([]);
});

test('async mergeAll – empty inners', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(5, 0);
        yield timer(5, 2);
        yield timer(5, 0);
        yield timer(5, 1);
    }

    const result = await collectAsync(
        pipeAsync(source(), mergeAll())
    );

    expect(result).toEqual([0, 0, 1]);
});

test('async mergeAll – works with map', async () => {
    async function* source(): AsyncIterable<AsyncIterable<number>> {
        yield timer(10, 2);
        yield timer(10, 1);
    }

    const result = await collectAsync(
        pipeAsync(
            source(),
            mergeAll(),
            map(x => x * 10)
        )
    );

    expect(result).toEqual([0, 0, 10]);
});