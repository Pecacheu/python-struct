import { Buffer } from 'buffer';

/*
Copied over from python's notes:

Optional first char:
@: native order, size & alignment (default)
=: native order, std. size & alignment
<: little-endian, std. size & alignment
>: big-endian, std. size & alignment
!: same as >

The remaining chars indicate types of args and must match exactly;
these can be preceded by a decimal repeat count:

x: pad byte (no data)
c: char
b: signed byte
B: unsigned byte
h: short
H: unsigned short
i: int
I: unsigned int
l: long
L: unsigned long
f: float
d: double
s: string (array of char, preceding decimal count indicates length)
p: pascal string (with count byte, preceding decimal count indicates length)
P: an integer type that is wide enough to hold a pointer (only available in native format)
q: long long (not in native mode unless 'long long' in platform C)
Q: unsigned long long (not in native mode unless 'long long' in platform C)
?: boolean
*/

/** Callback for struct.pack type
@param val Value being packed
@param pack Pack buffer
@param ofs Current offset
@param len Repeat length
@param us Unsigned type -OR- encoding for string type
@param le Little endian */
export type PackFunc<T> = (val: T, pack: Buffer, ofs: number, len: number,
	us: boolean | BufferEncoding | 'raw', le: boolean) => void;

/** Callback for struct.unpack type
@param data Unpack buffer
@param ofs Current offset
@param len Repeat length
@param us Unsigned type -OR- encoding for string type
@param le Little endian */
export type UnpackFunc<T> = (data: Buffer, ofs: number, len: number,
	us: boolean | BufferEncoding | 'raw', le: boolean) => T;

type CL = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
	| 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '?';
type Char = CL | Uppercase<CL>;

type PackOpt = [
	/** `-1` to mark as a string type */
	size: number,
	pack?: PackFunc<any>,
	unpack?: UnpackFunc<any>,
	unsigned?: boolean
];

export type StructOpts = Partial<{
	/** If the system uses little endian */
	isLittleEndian: boolean;
	/** If the system is 64-bit */
	is64bit: boolean;
	/** String encoding, defaults to `utf8`. Use `raw` to return string as Buffer instead */
	encoding: BufferEncoding | 'raw';
} & {[k in Char]: PackOpt}>;

//======== Default Pack Methods ========

const packStr: PackFunc<string | Buffer> = (val, pack, ofs, len, enc) => {
	const size = val instanceof Buffer ? val.copy(pack, ofs, 0, len) :
		typeof val === 'string' ? pack.write(val, ofs, len, enc as BufferEncoding) : -1;
	if(size === -1) throw "Bad type for string";
	if(size < len) pack.fill(0, ofs + size, ofs + len);
};
const unpackStr: UnpackFunc<string | Buffer> = (data, ofs, len, enc) => {
	data = data.subarray(ofs, ofs + len);
	if(enc === 'raw') return data;
	const zero = data.indexOf(0);
	return data.toString(enc as BufferEncoding, 0, zero === -1 ? undefined : zero);
};

const packPStr: PackFunc<string | Buffer> = (val, pack, ofs, len, enc) => {
	if(!(val instanceof Buffer)) {
		if(typeof val !== 'string') throw "Bad type for pascal";
		val = Buffer.from(val, enc as BufferEncoding);
	}
	const size = Math.min(val.length, len - 1, 255);
	pack[ofs] = size, ++ofs, --len;
	val.copy(pack, ofs, 0, size);
	if(size < len) pack.fill(0, ofs + size, ofs + len);
};
const unpackPStr: UnpackFunc<string | Buffer> = (data, ofs, len, enc) => enc === 'raw' ?
	data.subarray(ofs + 1, ofs + 1 + Math.min(data[ofs]!, len - 1)) :
	data.toString(enc as BufferEncoding, ofs + 1, ofs + 1 + Math.min(data[ofs]!, len - 1));

const packChar: PackFunc<string> = (val, pack, ofs) => {
	if(typeof val !== 'string') throw "Bad type for char";
	pack[ofs] = val.charCodeAt(0);
};
const unpackChar: UnpackFunc<string> = (data, ofs) => String.fromCharCode(data[ofs]!);

const pack8: PackFunc<number> = (val, pack, ofs, _, us) => {
	if(typeof val !== 'number') throw `Bad type for ${us ? 'u' : ''}int8`;
	if(us) pack.writeUInt8(val, ofs); else pack.writeInt8(val, ofs);
};
const unpack8: UnpackFunc<number> = (data, ofs, _, us) =>
	us ? data.readUint8(ofs) : data.readInt8(ofs);

const pack16: PackFunc<number> = (val, pack, ofs, _, us, le) => {
	if(typeof val !== 'number') throw `Bad type for ${us ? 'u' : ''}int16`;
	if(le) {
		if(us) pack.writeUInt16LE(val, ofs); else pack.writeInt16LE(val, ofs);
	} else {
		if(us) pack.writeUInt16BE(val, ofs); else pack.writeInt16BE(val, ofs);
	}
};
const unpack16: UnpackFunc<number> = (data, ofs, _, us, le) => le ?
	us ? data.readUInt16LE(ofs) : data.readInt16LE(ofs) :
	us ? data.readUInt16BE(ofs) : data.readInt16BE(ofs);

const pack32: PackFunc<number> = (val, pack, ofs, _, us, le) => {
	if(typeof val !== 'number') throw `Bad type for ${us ? 'u' : ''}int32`;
	if(le) {
		if(us) pack.writeUInt32LE(val, ofs); else pack.writeInt32LE(val, ofs);
	} else {
		if(us) pack.writeUInt32BE(val, ofs); else pack.writeInt32BE(val, ofs);
	}
};
const unpack32: UnpackFunc<number> = (data, ofs, _, us, le) => le ?
	us ? data.readUInt32LE(ofs) : data.readInt32LE(ofs) :
	us ? data.readUInt32BE(ofs) : data.readInt32BE(ofs);

const packFloat: PackFunc<number> = (val, pack, ofs, _, _1, le) => {
	if(typeof val !== 'number') throw `Bad type for float`;
	if(le) pack.writeFloatLE(val, ofs); else pack.writeFloatBE(val, ofs);
};
const unpackFloat: UnpackFunc<number> = (data, ofs, _, _1, le) => le ?
	data.readFloatLE(ofs) : data.readFloatBE(ofs);

const packDouble: PackFunc<number> = (val, pack, ofs, _, _1, le) => {
	if(typeof val !== 'number') throw `Bad type for float`;
	if(le) pack.writeDoubleLE(val, ofs); else pack.writeDoubleBE(val, ofs);
};
const unpackDouble: UnpackFunc<number> = (data, ofs, _, _1, le) => le ?
	data.readDoubleLE(ofs) : data.readDoubleBE(ofs);

const packBool: PackFunc<boolean> = (val, pack, ofs) => pack[ofs] = val ? 1 : 0;
const unpackBool: UnpackFunc<boolean> = (data, ofs) => data[ofs] !== 0;

//======== 64-bit BigInt Support ========

//@ts-expect-error import
let Long: typeof import('long');
//@ts-expect-error import
try {Long = await import('long')} catch(e) {}

const pack64: PackFunc<bigint | number | string | typeof Long> = (val, pack, ofs, _, us, le) => {
	if(Long && val instanceof Long) {
		if(le) {
			pack.writeInt32LE(val.getLowBits(), ofs);
			pack.writeInt32LE(val.getHighBits(), ofs + 4);
		} else {
			pack.writeInt32BE(val.getHighBits(), ofs);
			pack.writeInt32BE(val.getLowBits(), ofs + 4);
		}
		return;
	}
	if(typeof val === 'string' || typeof val === 'number') val = BigInt(val);
	else if(typeof val !== 'bigint') throw `Bad type for ${us ? 'u' : ''}int64`;

	if(le) {
		if(us) pack.writeBigUInt64LE(val, ofs); else pack.writeBigInt64LE(val, ofs);
	} else {
		if(us) pack.writeBigUInt64BE(val, ofs); else pack.writeBigInt64BE(val, ofs);
	}
};
const unpack64: UnpackFunc<bigint> = (data, ofs, _, us, le) => le ?
	us ? data.readBigUInt64LE(ofs) : data.readBigInt64LE(ofs) :
	us ? data.readBigUInt64BE(ofs) : data.readBigInt64BE(ofs);

//======== Main Class ========

export class StructError extends Error {}

function err(e: any, i: number, o?: number) {
	const s = `At ${i} in format${o ? `, ${o} in data` : ''}: ${e}`;
	//@ts-expect-error cause
	throw new StructError(s, e instanceof Error ? {cause: e} : undefined);
}

export class PythonStruct {
	readonly isLE;
	readonly is64bit;
	readonly enc;
	readonly map: StructOpts;

	/** Instantiate a struct class with custom overrides */
	constructor(opts: StructOpts) {
		this.isLE = opts.isLittleEndian ?? true;
		this.is64bit = opts.is64bit ?? true;
		this.enc = opts.encoding || 'utf8';

		//Merge opts with defaults
		this.map = {
			x: [-1],
			c: [1, packChar, unpackChar],
			b: [1, pack8, unpack8],
			B: [1, pack8, unpack8, true],
			h: [2, pack16, unpack16],
			H: [2, pack16, unpack16, true],
			i: [4, pack32, unpack32],
			I: [4, pack32, unpack32, true],
			l: [4, pack32, unpack32],
			L: [4, pack32, unpack32, true],
			f: [4, packFloat, unpackFloat],
			d: [8, packDouble, unpackDouble],
			s: [-1, packStr, unpackStr],
			p: [-1, packPStr, unpackPStr],
			P: [
				this.is64bit ? 8 : 4,
				this.is64bit ? pack64 : pack32,
				this.is64bit ? unpack64 : unpack32
			],
			q: [8, pack64, unpack64],
			Q: [8, pack64, unpack64, true],
			'?': [1, packBool, unpackBool],
			...opts
		};
	}

	_getType(fmt: string) {
		let isLE = this.isLE, native, skipOne = true;
		switch(fmt[0]) {
			case '<': isLE = true; break;
			case '>': case '!': isLE = false; break;
			case '=': break;
			default: skipOne = false; //Fallthrough
			case '@': native = true;
		}
		return [isLE, native, skipOne];
	}

	/** Calculate size of format string */
	sizeOf(format: string) {
		const [, native, skipOne] = this._getType(format);
		const len = format.length;
		let i = skipOne ? 1 : 0, size = 0, dec = null, c, op, sz;

		try {
			for(; i < len; ++i) {
				c = format[i]!;
				if(c === ' ') continue;
				if(c >= '0' && c <= '9') {
					dec = dec === null ? c : dec + c;
					continue;
				}

				op = this.map[c as Char] as PackOpt;
				if(!op) throw `Bad char '${c}' in struct format`;

				//Align if native
				sz = op[0];
				if(sz === -1) sz = 1;
				else if(native && sz > 1) size = Math.ceil(size / sz) * sz;

				//Update size
				size += sz * (dec ? Number(dec) : 1);
				dec = null;
			}
		} catch(e) {err(e, i)}
		return size;
	}

	/** Unpack the buffer `data` using `format` */
	unpack(format: string, data: Buffer) {
		return this.unpackFrom(format, data, 0);
	}

	/** Unpack the buffer `data` using `format` beginning at offset `start` */
	unpackFrom(format: string, data: Buffer, start: number) {
		const [isLE, native, skipOne] = this._getType(format);
		const len = format.length, vals: any[] = [];
		let i = skipOne ? 1 : 0, ofs = start, dec = null, str, c, op, sz;

		try {
			for(; i < len; i++) {
				c = format[i]!;
				if(c === ' ') continue;
				if(c >= '0' && c <= '9') {
					dec = dec === null ? c : dec + c;
					continue;
				}

				op = this.map[c as Char] as PackOpt;
				if(!op) throw "Bad char in struct format";

				//Align if native
				sz = op[0];
				if(native && sz > 1) ofs = Math.ceil(ofs / sz) * sz;

				//Check total len
				dec = dec ? Number(dec) : 1, str = sz === -1;
				if(str) sz = dec, dec = 1;

				//Unpack
				for(; dec; --dec) {
					if(ofs + sz > data.length) throw "Not enough data to unpack";
					if(op[2]) vals.push(op[2](data, ofs, sz, str ? this.enc : op[3]!, isLE!));
					ofs += sz;
				}
				dec = null;
			}
		} catch(e) {err(e, i, ofs)}
		return vals;
	}

	/** Pack data into a Buffer using `format`
	@param data Can be either an Array or arguments list */
	pack(format: string, ...data: any) {
		if(data.length === 1 && Array.isArray(data[0])) data = data[0];

		const [isLE, native, skipOne] = this._getType(format);
		const len = format.length, pack = Buffer.alloc(this.sizeOf(format));
		let i = skipOne ? 1 : 0, di = 0, ofs = 0, dec = null, str, c, op, sz;

		try {
			for(; i < len; i++) {
				c = format[i]!;
				if(c === ' ') continue;
				if(c >= '0' && c <= '9') {
					dec = dec === null ? c : dec + c;
					continue;
				}

				op = this.map[c as Char] as PackOpt;
				if(!op) throw "Bad char in struct format";

				//Align if native
				sz = op[0];
				if(native && sz > 1) ofs = Math.ceil(ofs / sz) * sz;

				//Check total len
				dec = dec ? Number(dec) : 1, str = sz === -1;
				if(str) sz = dec, dec = 1;

				//Pack
				for(; dec; --dec) {
					if(op[1]) {
						if(di >= data.length) throw "Not enough data to pack";
						op[1](data[di], pack, ofs, sz, str ? this.enc : op[3]!, isLE!);
						++di;
					}
					ofs += sz;
				}
				dec = null;
			}
		} catch(e) {err(e, i, di)}
		return pack;
	}
}

export default PythonStruct;