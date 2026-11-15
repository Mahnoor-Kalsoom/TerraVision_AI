import zlib from "node:zlib";

/**
 * Creates a valid 256x256 8-bit grayscale PNG buffer from a pixel generator function.
 * 0 = dry land (black), 255 = flood water (white).
 */
export function generateBinaryMaskPng(
    width: number,
    height: number,
    getPixel: (x: number, y: number) => number
): Buffer {
    const lines: Buffer[] = [];
    for (let y = 0; y < height; y++) {
        const row = Buffer.alloc(1 + width);
        row[0] = 0; // Filter type: None
        for (let x = 0; x < width; x++) {
            row[1 + x] = getPixel(x, y);
        }
        lines.push(row);
    }
    const raw = Buffer.concat(lines);
    const compressed = zlib.deflateSync(raw);

    // Precomputed CRC table
    const crcTable: number[] = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        crcTable[n] = c;
    }

    function crc32(buf: Buffer): number {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) {
            c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
        }
        return (c ^ 0xFFFFFFFF) >>> 0;
    }

    function makeChunk(type: string, data: Buffer): Buffer {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const typeAndData = Buffer.concat([Buffer.from(type), data]);
        const crc = Buffer.alloc(4);
        crc.writeUInt32BE(crc32(typeAndData), 0);
        return Buffer.concat([len, typeAndData, crc]);
    }

    const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8; // Bit depth: 8
    ihdrData[9] = 0; // Color type: Grayscale
    ihdrData[10] = 0; // Compression: Deflate
    ihdrData[11] = 0; // Filter: Standard
    ihdrData[12] = 0; // Interlace: None

    const ihdr = makeChunk("IHDR", ihdrData);
    const idat = makeChunk("IDAT", compressed);
    const iend = makeChunk("IEND", Buffer.alloc(0));

    return Buffer.concat([sig, ihdr, idat, iend]);
}
