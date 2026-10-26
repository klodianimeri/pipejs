export async function* timer(interval: number, count = Infinity): AsyncIterable<number> {
    let emitted = 0;
    while (emitted < count) {
        if (count > 0) {
            await new Promise(r => setTimeout(r, interval));
        }
        yield emitted;
        emitted++;
    }
}