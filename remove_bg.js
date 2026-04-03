const sharp = require('sharp');

async function removeBackground(inputPath, outputPath) {
    const image = sharp(inputPath);
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8ClampedArray(data);
    const visited = new Uint8Array(width * height);

    const getIdx = (x, y) => (y * width + x) * channels;
    const isClose = (r1, g1, b1, r2, g2, b2, tol) =>
        Math.abs(r1 - r2) < tol && Math.abs(g1 - g2) < tol && Math.abs(b1 - b2) < tol;

    // Sample background color from the top-left corner
    const bgR = pixels[0], bgG = pixels[1], bgB = pixels[2];
    console.log(`Background color detected: rgb(${bgR}, ${bgG}, ${bgB})`);

    // Flood fill from all 4 corners
    const queue = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
    const tolerance = 40;

    while (queue.length > 0) {
        const [x, y] = queue.pop();
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const flatIdx = y * width + x;
        if (visited[flatIdx]) continue;
        visited[flatIdx] = 1;

        const idx = getIdx(x, y);
        const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];

        if (isClose(r, g, b, bgR, bgG, bgB, tolerance)) {
            pixels[idx + 3] = 0; // transparent
            queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    await sharp(Buffer.from(pixels), {
        raw: { width, height, channels }
    }).png().toFile(outputPath);

    console.log('Done! Saved transparent logo to:', outputPath);
}

removeBackground('./polarislogo_v3.png', './polarislogo_nobg.png');
