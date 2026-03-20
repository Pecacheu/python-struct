# python-struct (Pecacheu Fork :P)
[![npm Version](https://badge.fury.io/js/python-struct.png)](https://npmjs.org/package/python-struct)

Packs/Unpacks/Measures structs according to Python's `struct` format. Now with BigInt support and type hinting!

## Installation
```
npm i github:Pecacheu/python-struct
```

## Usage example
```js
import struct from 'python-struct';

struct.sizeOf('s');
// -> 1

struct.sizeOf('>ii xx Q 10s ?');
// -> 29

struct.pack('>2i2xQ10s?', [1234, 5678, BigInt('12345678901234567890'), 'abcdefg', true]);
// -> <Buffer 00 00 04 d2 00 00 16 2e 00 00 ab 54 a9 8c eb 1f 0a d2 61 62 63 64 65 66 67 00 00 00 01>

struct.unpack('>2i2xQ10s?', Buffer.from('000004d20000162e0000ab54a98ceb1f0ad26162636465666700000001', 'hex'));
// -> [ 1234, 5678, 12345678901234567890n, 'abcdefg', true ]
```

## Usage in the browser
The `"browser"` entry in `package.json` will automatically redirect to the browser adapter for the package. *But* you'll have to `npm i buffer` in your project.

## Custom format overrides
You can instantiate a new instance of the *PythonStruct* class to change options, override built-in types, or even add any other letter as a custom type.

```js
import { PythonStruct } from './dist/node_adapter.js';

const struct = new PythonStruct({
	//Set base options
	isLittleEndian: true,
	is64bit: true,
	encoding: 'utf16le',

	//Define custom type 'y'
	y: [
		//Byte size
		4,
		//Pack callback
		(val, pack, ofs, len, unsigned, litEnd) => {
			if(litEnd) pack.writeFloatLE(val, ofs);
			else pack.writeFloatBE(val, ofs);
		},
		//Unpack callback
		(data, ofs, len, unsigned, litEnd) => {
			if(litEnd) return data.readFloatLE(ofs);
			else return data.readFloatBE(ofs);
		},
		//Unsigned flag
		false
	]
});

struct.sizeOf('y');
// -> 4

const data = struct.pack('<y', 716);
// -> <Buffer 00 00 33 44>

struct.unpack('<y', data);
// -> [ 716 ]
```

## Notes
When using "native" size & alignment, we do not really have a way to find the native size of alignment of types. But it's almost always safe to assume that `node_adapter.js` is compiled for the standard architectures, so `native` behaves like `standard`.

If anyone stumbles across a different case, I'll be happy to review it on that specific instance, and figure out what to do.

## About
This library was originally written by @danielgindi. This is just my feature-extended TypeScript fork. Please see https://github.com/danielgindi/node-python-struct for issues and contributions. Thanks!

## License
All the code here is under MIT license. Which means you could do virtually anything with the code.
I will appreciate it very much if you keep an attribution where appropriate.

    The MIT License (MIT)

    Copyright (c) 2013 Daniel Cohen Gindi (danielgindi@gmail.com)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.