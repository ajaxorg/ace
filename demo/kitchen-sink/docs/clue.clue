@iflua jit {
	local fn pack(...) {
		return love.data.pack("string", ...)
	}
	local fn unpack(...) {
		return love.data.unpack(...)
	}
	local fn mtype(x) {
		if type(x) != "number" {
			return
		} elseif x == math.floor(x) {
			return "integer"
		} else {
			return "float"
		}
	}
	local utf8len = require("utf8").len
	local tconcat, tunpack = table.concat, _G.unpack
	local ssub = string.sub
	local type, pcall, pairs, select = type, pcall, pairs, select
} @else {
	@if all(not(lua(5.4)), not(lua(5.3))) {
		@print "Warning: Lua version not specified, defaulting to Lua5.4"
	}
	local {pack, unpack} = string
	local mtype, utf8len = math.type, utf8.len
	local tconcat, tunpack = table.concat, table.unpack
	local ssub = string.sub
	local type, pcall, pairs, select = type, pcall, pairs, select
}

//ENCODER
local encode_value //forward declaration

local fn is_an_array(value) {
	local expected = 1
	for k of value {
		if k != expected {
			return false
		}
		expected += 1
	}
	return true
}

local encoder_functions = {
	["nil"] = fn {
		return pack("B", 0xc0)
	},
	["boolean"] = fn(value) {
		if value {
			return pack("B", 0xc3)
		} else {
			return pack("B", 0xc2)
		}
	},
	["number"] = fn(value) {
		if mtype(value) == "integer" {
			if value >= 0 {
				if value < 128 {
					return pack("B", value)
				} elseif value <= 0xff {
					return pack("BB", 0xcc, value)
				} elseif value <= 0xffff {
					return pack(">BI2", 0xcd, value)
				} elseif value <= 0xffffffff {
					return pack(">BI4", 0xce, value)
				} else {
					return pack(">BI8", 0xcf, value)
				}
			} else {
				if value >= -32 {
					return pack("B", 0xe0 + (value + 32))
				} elseif value >= -128 {
					return pack("Bb", 0xd0, value)
				} elseif value >= -32768 {
					return pack(">Bi2", 0xd1, value)
				} elseif value >= -2147483648 {
					return pack(">Bi4", 0xd2, value)
				} else {
					return pack(">Bi8", 0xd3, value)
				}
			}
		} else {
			local test = unpack("f", pack("f", value))
			if test == value { //check if we can use float
				return pack(">Bf", 0xca, value)
			} else {
				return pack(">Bd", 0xcb, value)
			}
		}
	},
	["string"] = fn(value) {
		local len = #value
		if utf8len(value) { //check if it is a real utf8 string or just byte junk
			if len < 32 {
				return pack("B", 0xa0 + len) .. value
			} elseif len < 256 {
				return pack(">Bs1", 0xd9, value)
			} elseif len < 65536 {
				return pack(">Bs2", 0xda, value)
			} else {
				return pack(">Bs4", 0xdb, value)
			}
		} else { //encode it as byte-junk :)
			if len < 256 {
				return pack(">Bs1", 0xc4, value)
			} elseif len < 65536 {
				return pack(">Bs2", 0xc5, value)
			} else {
				return pack(">Bs4", 0xc6, value)
			}
		}
	},
	["table"] = fn(value) {
		if is_an_array(value) { //it seems to be a proper Lua array
			local elements = {}
			for i, v of value {
				elements[i] = encode_value(v)
			}

			local length = #elements
			if length < 16 {
				return pack(">B", 0x90 + length) .. tconcat(elements)
			} elseif length < 65536 {
				return pack(">BI2", 0xdc, length) .. tconcat(elements)
			} else {
				return pack(">BI4", 0xdd, length) .. tconcat(elements)
			}
		} else { //encode as a map
			local elements = {}
			for k, v of value {
				if type(v) != "function" {
					elements[#elements + 1] = encode_value(k)
					elements[#elements + 1] = encode_value(v)
				}
			}

			local length = #elements /_ 2
			if length < 16 {
				return pack(">B", 0x80 + length) .. tconcat(elements)
			} elseif length < 65536 {
				return pack(">BI2", 0xde, length) .. tconcat(elements)
			} else {
				return pack(">BI4", 0xdf, length) .. tconcat(elements)
			}
		}
	},
	["function"] = fn {
		return pack("B", 0xc0)
	}
}

encode_value = fn(value) {
	return encoder_functions[type(value)](value)
}

local fn encode(...) {
	local data = {}
	for i = 1, select("#", ...) {
		data[#data + 1] = encode_value(select(i, ...))
	}
	return tconcat(data)
}


//DECODER
local decode_value //forward declaration

local fn decode_array(data, position, length) {
	local elements, value = {}
	for i = 1, length {
		value, position = decode_value(data, position)
		elements[i] = value
	}
	return elements, position
}

local fn decode_map(data, position, length) {
	local elements, key, value = {}
	for i = 1, length {
		key, position = decode_value(data, position)
		value, position = decode_value(data, position)
		elements[key] = value
	}
	return elements, position
}

local decoder_functions = {
	[0xc0] = fn(data, position) {
		return nil, position
	},
	[0xc2] = fn(data, position) {
		return false, position
	},
	[0xc3] = fn(data, position) {
		return true, position
	},
	[0xc4] = fn(data, position) {
		return unpack(">s1", data, position)
	},
	[0xc5] = fn(data, position) {
		return unpack(">s2", data, position)
	},
	[0xc6] = fn(data, position) {
		return unpack(">s4", data, position)
	},
	[0xca] = fn(data, position) {
		return unpack(">f", data, position)
	},
	[0xcb] = fn(data, position) {
		return unpack(">d", data, position)
	},
	[0xcc] = fn(data, position) {
		return unpack(">B", data, position)
	},
	[0xcd] = fn(data, position) {
		return unpack(">I2", data, position)
	},
	[0xce] = fn(data, position) {
		return unpack(">I4", data, position)
	},
	[0xcf] = fn(data, position) {
		return unpack(">I8", data, position)
	},
	[0xd0] = fn(data, position) {
		return unpack(">b", data, position)
	},
	[0xd1] = fn(data, position) {
		return unpack(">i2", data, position)
	},
	[0xd2] = fn(data, position) {
		return unpack(">i4", data, position)
	},
	[0xd3] = fn(data, position) {
		return unpack(">i8", data, position)
	},
	[0xd9] = fn(data, position) {
		return unpack(">s1", data, position)
	},
	[0xda] = fn(data, position) {
		return unpack(">s2", data, position)
	},
	[0xdb] = fn(data, position) {
		return unpack(">s4", data, position)
	},
	[0xdc] = fn(data, position) {
		local length
		length, position = unpack(">I2", data, position)
		return decode_array(data, position, length)
	},
	[0xdd] = fn(data, position) {
		local length
		length, position = unpack(">I4", data, position)
		return decode_array(data, position, length)
	},
	[0xde] = fn(data, position) {
		local length
		length, position = unpack(">I2", data, position)
		return decode_map(data, position, length)
	},
	[0xdf] = fn(data, position) {
		local length
		length, position = unpack(">I4", data, position)
		return decode_map(data, position, length)
	},
}

//add fix-array, fix-map, fix-string, fix-int stuff
for i = 0x00, 0x7f {
	decoder_functions[i] = fn(data, position) {
		return i, position
	}
}
for i = 0x80, 0x8f {
	decoder_functions[i] = fn(data, position) {
		return decode_map(data, position, i - 0x80)
	}
}
for i = 0x90, 0x9f {
	decoder_functions[i] = fn(data, position) {
		return decode_array(data, position, i - 0x90)
	}
}
for i = 0xa0, 0xbf {
	decoder_functions[i] = fn(data, position) {
		local length = i - 0xa0
		return ssub(data, position, position + length - 1), position + length
	}
}
for i = 0xe0, 0xff {
	decoder_functions[i] = fn(data, position) {
		return -32 + (i - 0xe0), position
	}
}

decode_value = fn(data, position) {
	local byte, value
	byte, position = unpack("B", data, position)
	value, position = decoder_functions[byte](data, position)
	return value, position
}

//INTERFACE
return {
	_AUTHOR = "Felice D'Angelo <https://github.com/Maiori44>",
	_VERSION = "0.2.1",

	//primary encode function
	encode = fn(...) {
		local data, ok = {}
		for i = 1, select("#", ...) {
			ok, data[i] = pcall(encode_value, select(i, ...))
			if !ok {
				return nil, "cannot encode MessagePack"
			}
		}
		return tconcat(data)
	},

	//encode just one value
	encode_one = fn(value) {
		local ok, data = pcall(encode_value, value)
		if ok {
			return data
		} else {
			return nil, "cannot encode MessagePack"
		}
	},

	//primary decode function
	decode = fn(data, position) {
		local values, value, ok = {}
		position ||= 1
		while position <= #data {
			ok, value, position = pcall(decode_value, data, position)
			if ok {
				values[#values + 1] = value
			} else {
				return nil, "cannot decode MessagePack"
			}
		}
		return tunpack(values)
	},

	//decode just one value
	decode_one = fn(data, position) {
		local value, ok
		ok, value, position = pcall(decode_value, data, position || 1)
		if ok {
			return value, position
		} else {
			return nil, "cannot decode MessagePack"
		}
	},
}
