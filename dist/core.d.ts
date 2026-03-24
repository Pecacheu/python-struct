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
    readonly map: {
        isLittleEndian?: boolean | undefined;
        is64bit?: boolean | undefined;
        encoding?: BufferEncoding | "raw" | undefined;
        a?: PackOpt | undefined;
        b: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        c: PackOpt | (number | PackFunc<string> | UnpackFunc<string>)[];
        d: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        e?: PackOpt | undefined;
        f: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        g?: PackOpt | undefined;
        h: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        i: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        j?: PackOpt | undefined;
        k?: PackOpt | undefined;
        l: PackOpt | (number | PackFunc<number> | UnpackFunc<number>)[];
        m?: PackOpt | undefined;
        n?: PackOpt | undefined;
        o?: PackOpt | undefined;
        p: PackOpt | (number | PackFunc<string | Buffer<ArrayBufferLike>> | UnpackFunc<string | Buffer<ArrayBufferLike>>)[];
        q: PackOpt | (number | PackFunc<any> | UnpackFunc<bigint>)[];
        r?: PackOpt | undefined;
        s: PackOpt | (number | PackFunc<string | Buffer<ArrayBufferLike>> | UnpackFunc<string | Buffer<ArrayBufferLike>>)[];
        t?: PackOpt | undefined;
        u?: PackOpt | undefined;
        v?: PackOpt | undefined;
        w?: PackOpt | undefined;
        x: PackOpt | number[];
        y?: PackOpt | undefined;
        z?: PackOpt | undefined;
        '?': PackOpt | (number | PackFunc<boolean> | UnpackFunc<boolean>)[];
        A?: PackOpt | undefined;
        B: PackOpt | (number | boolean | PackFunc<number> | UnpackFunc<number>)[];
        C?: PackOpt | undefined;
        D?: PackOpt | undefined;
        E?: PackOpt | undefined;
        F?: PackOpt | undefined;
        G?: PackOpt | undefined;
        H: PackOpt | (number | boolean | PackFunc<number> | UnpackFunc<number>)[];
        I: PackOpt | (number | boolean | PackFunc<number> | UnpackFunc<number>)[];
        J?: PackOpt | undefined;
        K?: PackOpt | undefined;
        L: PackOpt | (number | boolean | PackFunc<number> | UnpackFunc<number>)[];
        M?: PackOpt | undefined;
        N?: PackOpt | undefined;
        O?: PackOpt | undefined;
        P: PackOpt | (number | PackFunc<number> | UnpackFunc<number> | UnpackFunc<bigint>)[];
        Q: PackOpt | (number | boolean | PackFunc<any> | UnpackFunc<bigint>)[];
        R?: PackOpt | undefined;
        S?: PackOpt | undefined;
        T?: PackOpt | undefined;
        U?: PackOpt | undefined;
        V?: PackOpt | undefined;
        W?: PackOpt | undefined;
        X?: PackOpt | undefined;
        Y?: PackOpt | undefined;
        Z?: PackOpt | undefined;
    };
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