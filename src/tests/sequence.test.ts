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

export function* sequenceSync(start: number, end: number) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

export async function* sequenceAsync(start: number, end: number) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

export async function* sequenceIntervalAsync(start: number, end: number, interval: number = 0) {
    for (let i = start; i < end; i++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        yield i;
    }
}

test('avoid jest error', () => { });