export function isIterable(value: unknown): value is Iterable<unknown> {
    return (
        value != null &&
        typeof value !== "string" &&
        typeof (value as any)[Symbol.iterator] === "function"
    );
}