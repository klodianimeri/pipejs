export const Yields = (values: Array<any>): Array<IteratorYieldResult<any>> => {
    let yields: Array<IteratorYieldResult<any>> = new Array<IteratorYieldResult<any>>();
    for (let i = 0; i < values.length; i++) {
        yields[i] = { value: values[i], done: false };
    }
    return yields;
}