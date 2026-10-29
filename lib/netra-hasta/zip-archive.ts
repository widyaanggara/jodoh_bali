export interface ZipArchiveEntry {
  name: string;
  data: Uint8Array;
}

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_FILE_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const UTF8_FLAG = 0x0800;
const ZIP_VERSION = 20;

const CRC_TABLE = new Uint32Array(256);
for (let index = 0; index < CRC_TABLE.length; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  CRC_TABLE[index] = value >>> 0;
}

export function zipCrc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function assertSafeName(name: string): void {
  if (!name || name.includes("\\") || name.startsWith("/") || name.split("/").includes("..")) {
    throw new Error(`Nama entri ZIP tidak aman: ${name || "(kosong)"}.`);
  }
}

function concatBytes(chunks: Uint8Array[], totalLength: number): Uint8Array {
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

/** Builds a deterministic ZIP with uncompressed entries, preserving every input byte. */
export function createStoredZip(entries: ZipArchiveEntry[]): Uint8Array {
  if (!entries.length || entries.length > 0xffff) throw new Error("Jumlah entri ZIP tidak valid.");
  const encoder = new TextEncoder();
  const names = new Set<string>();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let localLength = 0;
  let centralLength = 0;

  for (const entry of entries) {
    assertSafeName(entry.name);
    if (names.has(entry.name)) throw new Error(`Entri ZIP duplikat: ${entry.name}.`);
    names.add(entry.name);
    const filename = encoder.encode(entry.name);
    if (filename.length > 0xffff || entry.data.length > 0xffffffff) {
      throw new Error(`Entri ZIP terlalu besar: ${entry.name}.`);
    }
    const crc = zipCrc32(entry.data);
    const localHeader = new Uint8Array(30 + filename.length);
    const local = new DataView(localHeader.buffer);
    local.setUint32(0, LOCAL_FILE_HEADER, true);
    local.setUint16(4, ZIP_VERSION, true);
    local.setUint16(6, UTF8_FLAG, true);
    local.setUint16(8, 0, true);
    local.setUint16(12, 0x21, true);
    local.setUint16(12, 0x21, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, entry.data.length, true);
    local.setUint32(22, entry.data.length, true);
    local.setUint16(26, filename.length, true);
    localHeader.set(filename, 30);

    const centralHeader = new Uint8Array(46 + filename.length);
    const central = new DataView(centralHeader.buffer);
    central.setUint32(0, CENTRAL_FILE_HEADER, true);
    central.setUint16(4, ZIP_VERSION, true);
    central.setUint16(6, ZIP_VERSION, true);
    central.setUint16(8, UTF8_FLAG, true);
    central.setUint16(10, 0, true);
    central.setUint16(14, 0x21, true);
    central.setUint16(14, 0x21, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, entry.data.length, true);
    central.setUint32(24, entry.data.length, true);
    central.setUint16(28, filename.length, true);
    central.setUint32(42, localLength, true);
    centralHeader.set(filename, 46);

    localChunks.push(localHeader, entry.data);
    centralChunks.push(centralHeader);
    localLength += localHeader.length + entry.data.length;
    centralLength += centralHeader.length;
  }

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, END_OF_CENTRAL_DIRECTORY, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralLength, true);
  endView.setUint32(16, localLength, true);
  return concatBytes([...localChunks, ...centralChunks, end], localLength + centralLength + end.length);
}

/** Reads and CRC-validates the local entries created by createStoredZip. */
export function readStoredZipEntries(archive: Uint8Array): Map<string, Uint8Array> {
  const decoder = new TextDecoder();
  const entries = new Map<string, Uint8Array>();
  const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
  let offset = 0;
  while (offset + 4 <= archive.length && view.getUint32(offset, true) === LOCAL_FILE_HEADER) {
    if (offset + 30 > archive.length) throw new Error("Header ZIP terpotong.");
    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const expectedCrc = view.getUint32(offset + 14, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const plainSize = view.getUint32(offset + 22, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    if (!(flags & UTF8_FLAG) || method !== 0 || compressedSize !== plainSize) {
      throw new Error("ZIP menggunakan format yang tidak didukung validator lokal.");
    }
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + plainSize;
    if (dataEnd > archive.length) throw new Error("Data entri ZIP terpotong.");
    const name = decoder.decode(archive.subarray(nameStart, nameStart + nameLength));
    assertSafeName(name);
    if (entries.has(name)) throw new Error(`Entri ZIP duplikat: ${name}.`);
    const data = archive.slice(dataStart, dataEnd);
    if (zipCrc32(data) !== expectedCrc) throw new Error(`CRC32 entri ZIP tidak cocok: ${name}.`);
    entries.set(name, data);
    offset = dataEnd;
  }
  if (!entries.size || offset + 4 > archive.length || view.getUint32(offset, true) !== CENTRAL_FILE_HEADER) {
    throw new Error("Central directory ZIP tidak ditemukan.");
  }
  return entries;
}
