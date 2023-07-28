export function color(hex: number) {
    return `#${hex.toString(16).padStart(6, "0")}`;
}
