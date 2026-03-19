let Long;
try { Long = require('long'); } catch (e) {}

const UNPACK_UINT64_LE = (data, pos) => new DataView(data.buffer, pos).getBigUint64(0, true);
const UNPACK_UINT64_BE = (data, pos) => new DataView(data.buffer, pos).getBigUint64(0, false);
const UNPACK_INT64_LE = (data, pos) => new DataView(data.buffer, pos).getBigInt64(0, true);
const UNPACK_INT64_BE = (data, pos) => new DataView(data.buffer, pos).getBigInt64(0, false);

const pack64 = (data, pack, pos, us, le) => {
    if (Long && data instanceof Long) {
        if (le) {
            pack.writeInt32LE(data.getLowBits(), pos, true);
            pack.writeInt32LE(data.getHighBits(), pos + 4, true);
        } else {
            pack.writeInt32BE(data.getHighBits(), pos, true);
            pack.writeInt32BE(data.getLowBits(), pos + 4, true);
        }
        return;
    }
    if (typeof data === 'string' || typeof data === 'number') data = BigInt(data);
    else if (typeof data !== 'bigint') throw `Bad type for ${us ? 'u' : ''}int64 @ ${pos}`;

    if (us) {
        if (le) pack.writeBigUInt64LE(data, pos); else pack.writeBigUInt64BE(data, pos);
    } else {
        if (le) pack.writeBigInt64LE(data, pos); else pack.writeBigInt64BE(data, pos);
    }
};

module.exports = {
    unpackUInt64LE: UNPACK_UINT64_LE,
    unpackUInt64BE: UNPACK_UINT64_BE,
    unpackInt64LE: UNPACK_INT64_LE,
    unpackInt64BE: UNPACK_INT64_BE,
    packUInt64LE: (d, k, p) => pack64(d, k, p, true, true),
    packUInt64BE: (d, k, p) => pack64(d, k, p, true, false),
    packInt64LE: (d, k, p) => pack64(d, k, p, false, true),
    packInt64BE: (d, k, p) => pack64(d, k, p, false, false),
};