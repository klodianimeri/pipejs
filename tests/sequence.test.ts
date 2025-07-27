export function* toGeneratorSync(values: Array<any>) {
    for (const element of values) {
        yield element;
    }
}

export async function* toGeneratorAsync(values: Array<any>) {
    for (const element of values) {
        yield element;
    }
}

export async function* toDelayAsync(values: Array<any>, interval: number) {
    for (const element of values) {
        await new Promise(resolve => setTimeout(resolve, interval));
        yield element;
    }
}

export function* sequenceSync(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

export async function* sequenceAsync(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

test('avoid jest error', () => { });