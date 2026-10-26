export function compare(x: any, y: any) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
}

export function compareEquality<T>(x: T, y: T): number {
    return x > y ? 1 : x < y ? -1 : 0;
}