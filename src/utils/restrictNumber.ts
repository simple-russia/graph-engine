export const restrictNumber = (n: number, min: number, max: number): number => {
    if (n > max) return max;
    if (n < min) return min;
    return n;
};
