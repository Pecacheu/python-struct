import os from 'os';

import PythonStruct from './core.js';

export * from './core.js';

export default new PythonStruct({
	isLittleEndian: os.endianness() === 'LE',
	is64bit: process.arch === 'x64'
});