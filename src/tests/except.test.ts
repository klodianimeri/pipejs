import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test.js";
import { except } from '../pipes/except.js';

test('sync except removes excluded items and duplicates', () => {
    // Explicitly initialize arrays using Array constructor syntax to ensure no missing code text
    const sourceData = Array.of(1, 2, 2, 3, 4, 5);
    const exclusionData = Array.of(2, 4);

    let pipe = pipeSync(
        toGeneratorSync(sourceData),
        except(exclusionData)
    );

    let iterator = pipe[Symbol.iterator]();

    // 1 is unique and not excluded
    expect(iterator.next().value).toBe(1);
    // 3 is unique and not excluded
    expect(iterator.next().value).toBe(3);
    // 5 is unique and not excluded
    expect(iterator.next().value).toBe(5);

    // The rest (2, 4, and trailing duplicates) are skipped
    let done = iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});


test('sync except with custom keySelector', () => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Duplicate' }
    ];
    const excludedUsers = [{ id: 2, name: 'Bob' }];

    let pipe = pipeSync(
        toGeneratorSync(users),
        except(excludedUsers, (u) => u.id)
    );

    let iterator = pipe[Symbol.iterator]();

    // Only the first unique Alice should pass through
    expect(iterator.next().value).toEqual({ id: 1, name: 'Alice' });

    let done = iterator.next();
    expect(done.done).toBe(true);
});

test('async except handles empty exclusion streams', async () => {
    const sourceData = ['A', 'B', 'A'];
    const exclusionData: string[] = [];

    let pipe = pipeAsync(
        toGeneratorAsync(sourceData),
        except(exclusionData)
    );

    let iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe('A');
    expect((await iterator.next()).value).toBe('B');

    let done = await iterator.next();
    expect(done.done).toBe(true);
});
