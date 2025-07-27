export function mapTo(value) {
    return () => {
        return (result) => {
            result.value = value;
            return result;
        };
    };
}
//# sourceMappingURL=map-to.js.map