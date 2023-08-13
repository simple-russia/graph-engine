export function color(hex: number, opacity=1) {
    return `#${hex.toString(16).padStart(6, "0")}${Math.floor(0xFF * opacity).toString(16).padStart(2, "0")}`;
}
