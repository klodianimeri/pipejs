export async function allSettled(promises: Promise<unknown>[]): Promise<void> {
    return Promise.all(
        promises.map((p) =>
            Promise.resolve(p).then(
                () => undefined,
                () => undefined
            )
        )
    ).then(() => undefined);
}