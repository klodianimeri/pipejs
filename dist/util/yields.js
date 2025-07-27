export const Yields = (values) => {
    let yields = new Array();
    for (let i = 0; i < values.length; i++) {
        yields[i] = { value: values[i], done: false };
    }
    return yields;
};
//# sourceMappingURL=yields.js.map