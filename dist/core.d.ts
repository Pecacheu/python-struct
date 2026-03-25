import { Buffer } from 'buffer';
/** Callback for struct.pack type
@param val Value being packed
@param pack Pack buffer
@param ofs Current offset
@param len Repeat length
@param us Unsigned type -OR- encoding for string type
@param le Little endian */
export type PackFunc<T> = (val: T, pack: Buffer, ofs: number, len: number, us: boolean | BufferEncoding | 'raw', le: boolean) => void;
/** Callback for struct.unpack type
@param data Unpack buffer
@param ofs Current offset
@param len Repeat length
@param us Unsigned type -OR- encoding for string type
@param le Little endian */
export type UnpackFunc<T> = (data: Buffer, ofs: number, len: number, us: boolean | BufferEncoding | 'raw', le: boolean) => T;
type CL = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '?';
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
} & {
    [k in Char]: PackOpt;
}>;
export declare class StructError extends Error {
}
export declare class PythonStruct {
    readonly isLE: boolean;
    readonly is64bit: boolean;
    readonly enc: BufferEncoding | "raw";
    readonly map: StructOpts;
    /** Instantiate a struct class with custom overrides */
    constructor(opts: StructOpts);
    _getType(fmt: string): (boolean | undefined)[];
    /** Calculate size of format string */
    sizeOf(format: string): number;
    /** Unpack the buffer `data` using `format` */
    unpack(format: string, data: Buffer): any[];
    /** Unpack the buffer `data` using `format` beginning at offset `start` */
    unpackFrom(format: string, data: Buffer, start: number): any[];
    /** Pack data into a Buffer using `format`
    @param data Can be either an Array or arguments list */
    pack(format: string, ...data: any): Buffer<ArrayBuffer>;
}
export default PythonStruct;
//# sourceMappingURL=core.d.ts.map