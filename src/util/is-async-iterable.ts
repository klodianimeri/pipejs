export function isAsyncIterable(value: unknown): value is Iterable<unknown> {
    return (
        value != null &&
        typeof value !== "string" &&
        typeof (value as any)[Symbol.asyncIterator] === "function"
    );
}