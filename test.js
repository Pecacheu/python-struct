import struct from './dist/node_adapter.js';

let fails = 0;
const jRep = (_, v) => typeof v === 'bigint' ? v.toString() : v,
	json = o => JSON.stringify(o, jRep);

function test(a, b) {
	if(a instanceof Buffer) a = `<Buffer ${a.toString('hex').match(/../g).join(' ')}>`;
	if(json(a) !== json(b)) {
		if(typeof b === 'number') console.log(a, b);
		else console.log(a), console.log(b);
		console.error("==> Fail <==\n");
		++fails;
	}
}

test(struct.sizeOf('0ps'), 1);
test(struct.sizeOf('>ii 2x Q 10s ?'), 29);
test(struct.sizeOf('ii2xQ10s?'), 35);

test(struct.pack('<10s', 'abc😊defghijk'), "<Buffer 61 62 63 f0 9f 98 8a 64 65 66>");
test(struct.unpack('<10s', Buffer.from('616263f09f988a6465666768696a', 'hex')), ["abc😊def"]);
test(struct.pack('11s', 'abcdefg'), "<Buffer 61 62 63 64 65 66 67 00 00 00 00>");
test(struct.unpack('2x12s', Buffer.from('000061626364656667000000000000', 'hex')), ["abcdefg"]);
test(struct.pack('1x11p', 'abcdefghijklmn'), "<Buffer 00 0a 61 62 63 64 65 66 67 68 69 6a>");
test(struct.unpack('1x10p', Buffer.from('00ff61626364656667000000', 'hex')), ["abcdefg\x00\x00"]);

test(struct.pack('<x2i4x', 1234, 5678), "<Buffer 00 d2 04 00 00 2e 16 00 00 00 00 00 00>");
test(struct.pack('<Q', [BigInt('12345678901234567890')]), "<Buffer d2 0a 1f eb 8c a9 54 ab>");
test(struct.unpack('<Q', Buffer.from('d20a1feb8ca954ab', 'hex')), [12345678901234567890n]);
test(struct.pack('>Q', [BigInt('12345678901234567890')]), "<Buffer ab 54 a9 8c eb 1f 0a d2>");
test(struct.unpack('>Q', Buffer.from('ab54a98ceb1f0ad2', 'hex')), [12345678901234567890n]);

test(struct.pack('>2ixxQ10s?', [1234, 5678, BigInt('12345678901234567890'), 'abcdefg', true]),
	"<Buffer 00 00 04 d2 00 00 16 2e 00 00 ab 54 a9 8c eb 1f 0a d2 61 62 63 64 65 66 67 00 00 00 01>");

const buf = Buffer.from('000004d20000162e0000ab54a98ceb1f0ad26162636465666700000001', 'hex');
test(struct.unpack('>iixxQ10s?', buf), [1234, 5678, 12345678901234567890n, "abcdefg", true]);

if(fails) throw `${fails} tests failed!`;
console.log("All tests passed!");