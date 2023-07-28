export function generateUUID () {
    // Length of each hex number part
    const partsLengths = [8, 4, 4, 4, 12];

    const parts = partsLengths
        .map(partLength => {
            // Generate a base16 number of partLength length
            const hexNumber = (0x10 ** partLength - 1) * Math.random();
            // Convert to string
            const hexNumberString = Math.floor(hexNumber).toString(16).padStart(partLength, "0");

            return hexNumberString;
        });

    // Concat strings
    return parts.join("-");
}
