export const assertSync = (value?: Iterable<any>) => {
    if (!value || typeof value[Symbol.iterator] !== 'function') {
        throw new Error(`Value not a sync iterator: ${value}`);
    }
};

export const assertSyncs = (sources: Array<Iterable<any>>) => {
    for (const source of sources) {
        assertSync(source);
    }
};