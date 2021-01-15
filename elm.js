(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bv.K === region.bc.K)
	{
		return 'on line ' + region.bv.K;
	}
	return 'on lines ' + region.bv.K + ' through ' + region.bc.K;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bh,
		impl.bE,
		impl.bz,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		v: func(record.v),
		af: record.af,
		ad: record.ad
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.v;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.af;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ad) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bh,
		impl.bE,
		impl.bz,
		function(sendToApp, initialModel) {
			var view = impl.bF;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bh,
		impl.bE,
		impl.bz,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ae && impl.ae(sendToApp)
			var view = impl.bF;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.a7);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bB) && (_VirtualDom_doc.title = title = doc.bB);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bn;
	var onUrlRequest = impl.bo;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ae: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aL === next.aL
							&& curr.ax === next.ax
							&& curr.aH.a === next.aH.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bh: function(flags)
		{
			return A3(impl.bh, flags, _Browser_getUrl(), key);
		},
		bF: impl.bF,
		bE: impl.bE,
		bz: impl.bz
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { be: 'hidden', a9: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { be: 'mozHidden', a9: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { be: 'msHidden', a9: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { be: 'webkitHidden', a9: 'webkitvisibilitychange' }
		: { be: 'hidden', a9: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aT: _Browser_getScene(),
		S: {
			a1: _Browser_window.pageXOffset,
			a2: _Browser_window.pageYOffset,
			y: _Browser_doc.documentElement.clientWidth,
			u: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		y: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		u: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aT: {
				y: node.scrollWidth,
				u: node.scrollHeight
			},
			S: {
				a1: node.scrollLeft,
				a2: node.scrollTop,
				y: node.clientWidth,
				u: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aT: _Browser_getScene(),
			S: {
				a1: x,
				a2: y,
				y: _Browser_doc.documentElement.clientWidth,
				u: _Browser_doc.documentElement.clientHeight
			},
			bb: {
				a1: x + rect.left,
				a2: y + rect.top,
				y: rect.width,
				u: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.j);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.k) : builder.k;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.j);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{k: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, j: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {au: fragment, ax: host, aF: path, aH: port_, aL: protocol, aM: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Msg$Jump = function (a) {
	return {$: 19, a: a};
};
var $author$project$Main$Loading = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $justinmimbs$date$Date$RD = $elm$core$Basics$identity;
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
			$elm$core$Basics$clamp,
			1,
			A2($justinmimbs$date$Date$daysInMonth, y, m),
			d);
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.bv, posixMinutes) < 0) {
					return posixMinutes + era.b;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		ao: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		aD: month,
		a3: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).ao;
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aD;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).a3;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$here = _Time_here(0);
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $justinmimbs$date$Date$today = A3($elm$core$Task$map2, $justinmimbs$date$Date$fromPosix, $elm$time$Time$here, $elm$time$Time$now);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		A2($author$project$Main$Loading, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A2($elm$core$Task$perform, $author$project$Msg$Jump, $justinmimbs$date$Date$today)
				])));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Skeleton$column = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('column expand'),
				attributes),
			children);
	});
var $author$project$Skeleton$expandingRow = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('row expand'),
				attributes),
			children);
	});
var $author$project$Skeleton$row = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('row compact'),
				attributes),
			children);
	});
var $author$project$Skeleton$layout = F2(
	function (navbar, page) {
		return A2(
			$author$project$Skeleton$column,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container-y')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$row,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('navbar no-select')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$column,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('container-x')
								]),
							_List_fromArray(
								[navbar]))
						])),
					A2(
					$author$project$Skeleton$expandingRow,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$column,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('container-x')
								]),
							_List_fromArray(
								[page]))
						]))
				]));
	});
var $author$project$Msg$AutoScrollCalendar = function (a) {
	return {$: 6, a: a};
};
var $author$project$Msg$ReceiveSelectDate = function (a) {
	return {$: 23, a: a};
};
var $author$project$Msg$VisibilityChange = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {aK: processes, aY: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.aK;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.aY);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Msg$KeyPressed = function (a) {
	return {$: 4, a: a};
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$keyPressDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Msg$KeyPressed,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aG: pids, aX: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {ar: event, aC: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aG,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.aC;
		var event = _v0.ar;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.aX);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyPress = A2($elm$browser$Browser$Events$on, 0, 'keypress');
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$browser$Browser$Events$Hidden = 1;
var $elm$browser$Browser$Events$Visible = 0;
var $elm$browser$Browser$Events$withHidden = F2(
	function (func, isHidden) {
		return func(
			isHidden ? 1 : 0);
	});
var $elm$browser$Browser$Events$onVisibilityChange = function (func) {
	var info = _Browser_visibilityInfo(0);
	return A3(
		$elm$browser$Browser$Events$on,
		0,
		info.a9,
		A2(
			$elm$json$Json$Decode$map,
			$elm$browser$Browser$Events$withHidden(func),
			A2(
				$elm$json$Json$Decode$field,
				'target',
				A2($elm$json$Json$Decode$field, info.be, $elm$json$Json$Decode$bool))));
};
var $author$project$Ports$selectDateFromScroll = _Platform_incomingPort('selectDateFromScroll', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (model) {
	if (model.$ === 1) {
		var _v1 = model.a;
		var activityM = _v1.c;
		return $elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					$author$project$Ports$selectDateFromScroll($author$project$Msg$ReceiveSelectDate),
					$elm$browser$Browser$Events$onVisibilityChange($author$project$Msg$VisibilityChange),
					function () {
					switch (activityM.$) {
						case 1:
							var form = activityM.a;
							return $elm$browser$Browser$Events$onKeyPress($author$project$Main$keyPressDecoder);
						case 0:
							return $elm$browser$Browser$Events$onKeyPress($author$project$Main$keyPressDecoder);
						case 2:
							var activity = activityM.a;
							var x = activityM.b;
							var y = activityM.c;
							return A2(
								$elm$time$Time$every,
								100,
								function (_v3) {
									return $author$project$Msg$AutoScrollCalendar(y);
								});
						default:
							return $elm$core$Platform$Sub$none;
					}
				}()
				]));
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $author$project$Msg$ChangeZoom = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var $author$project$Msg$ClickedSubmit = {$: 37};
var $author$project$Msg$Create = function (a) {
	return {$: 10, a: a};
};
var $author$project$Msg$Editing = function (a) {
	return {$: 1, a: a};
};
var $author$project$Msg$LoadToday = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$Loaded = function (a) {
	return {$: 1, a: a};
};
var $author$project$Msg$Month = 1;
var $author$project$Msg$Move = F2(
	function (a, b) {
		return {$: 14, a: a, b: b};
	});
var $author$project$Msg$Moving = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Msg$NewActivity = function (a) {
	return {$: 26, a: a};
};
var $author$project$Msg$NoOp = {$: 9};
var $author$project$Msg$None = {$: 3};
var $author$project$Msg$Selected = function (a) {
	return {$: 0, a: a};
};
var $author$project$Msg$SelectedDate = function (a) {
	return {$: 29, a: a};
};
var $author$project$Main$State = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Msg$Year = 0;
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Store$flush = function (model) {
	if (!model.b.b) {
		var state = model.a;
		return $elm$core$Platform$Cmd$none;
	} else {
		var state = model.a;
		var msgs = model.b;
		return $elm$core$Platform$Cmd$none;
	}
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $author$project$Calendar$get = function (_v0) {
	var zoom = _v0.a;
	var start = _v0.b;
	var end = _v0.c;
	var selected = _v0.d;
	var today = _v0.e;
	var scrollCompleted = _v0.f;
	return {bc: end, bs: scrollCompleted, bt: selected, bv: start, bD: today, a4: zoom};
};
var $author$project$Store$get = F2(
	function (_v0, f) {
		var state = _v0.a;
		return f(state);
	});
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $author$project$Msg$ActivityForm = F5(
	function (id, date, description, result, dataForm) {
		return {g: dataForm, an: date, ap: description, ay: id, L: result};
	});
var $author$project$Msg$IntervalForm = function (a) {
	return {$: 1, a: a};
};
var $author$project$Msg$NoteForm = function (a) {
	return {$: 4, a: a};
};
var $author$project$Msg$OtherForm = function (a) {
	return {$: 3, a: a};
};
var $author$project$Msg$RaceForm = function (a) {
	return {$: 2, a: a};
};
var $author$project$Msg$RunForm = function (a) {
	return {$: 0, a: a};
};
var $author$project$Msg$SessionForm = function (a) {
	return {$: 5, a: a};
};
var $author$project$ActivityForm$init = function (activity) {
	var baseModel = A4(
		$author$project$Msg$ActivityForm,
		activity.ay,
		$elm$core$Maybe$Just(activity.an),
		activity.ap,
		$elm$core$Result$Ok(activity));
	return baseModel(
		function () {
			var _v0 = activity.T;
			switch (_v0.$) {
				case 0:
					var minutes = _v0.a;
					var pace_ = _v0.b;
					var completed = _v0.c;
					return $author$project$Msg$RunForm(
						{
							e: completed,
							f: $elm$core$String$fromInt(minutes),
							l: pace_
						});
				case 1:
					var seconds = _v0.a;
					var pace_ = _v0.b;
					var completed = _v0.c;
					return $author$project$Msg$IntervalForm(
						{
							e: completed,
							f: $elm$core$String$fromInt(seconds),
							l: pace_
						});
				case 2:
					var minutes = _v0.a;
					var distance_ = _v0.b;
					var completed = _v0.c;
					return $author$project$Msg$RaceForm(
						{
							e: completed,
							p: distance_,
							f: $elm$core$String$fromInt(minutes)
						});
				case 3:
					var minutes = _v0.a;
					var completed = _v0.b;
					return $author$project$Msg$OtherForm(
						{
							e: completed,
							f: $elm$core$String$fromInt(minutes)
						});
				case 4:
					var emoji_ = _v0.a;
					return $author$project$Msg$NoteForm(
						{t: emoji_});
				default:
					var activities = _v0.a;
					return $author$project$Msg$SessionForm(activities);
			}
		}());
};
var $author$project$Calendar$Model = F6(
	function (a, b, c, d, e, f) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $justinmimbs$date$Date$Quarter = 1;
var $justinmimbs$date$Date$Months = 1;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		case 7:
			return 6;
		case 8:
			return 7;
		case 9:
			return 8;
		case 10:
			return 9;
		case 11:
			return 10;
		default:
			return 11;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {ao: d, aD: m, a3: y};
			}
		}
	});
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0;
	var y = $justinmimbs$date$Date$year(rd);
	return {
		ac: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		a3: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0;
	var date = $justinmimbs$date$Date$toOrdinalDate(rd);
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.a3, 0, date.ac);
};
var $justinmimbs$date$Date$add = F3(
	function (unit, n, _v0) {
		var rd = _v0;
		switch (unit) {
			case 0:
				return A3($justinmimbs$date$Date$add, 1, 12 * n, rd);
			case 1:
				var date = $justinmimbs$date$Date$toCalendarDate(rd);
				var wholeMonths = ((12 * (date.a3 - 1)) + ($justinmimbs$date$Date$monthToNumber(date.aD) - 1)) + n;
				var m = $justinmimbs$date$Date$numberToMonth(
					A2($elm$core$Basics$modBy, 12, wholeMonths) + 1);
				var y = A2($justinmimbs$date$Date$floorDiv, wholeMonths, 12) + 1;
				return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A2(
					$elm$core$Basics$min,
					date.ao,
					A2($justinmimbs$date$Date$daysInMonth, y, m));
			case 2:
				return rd + (7 * n);
			default:
				return rd + n;
		}
	});
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$weekdayToNumber = function (wd) {
	switch (wd) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 7;
	}
};
var $justinmimbs$date$Date$daysSincePreviousWeekday = F2(
	function (wd, date) {
		return A2(
			$elm$core$Basics$modBy,
			7,
			($justinmimbs$date$Date$weekdayNumber(date) + 7) - $justinmimbs$date$Date$weekdayToNumber(wd));
	});
var $justinmimbs$date$Date$firstOfMonth = F2(
	function (y, m) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + 1;
	});
var $justinmimbs$date$Date$firstOfYear = function (y) {
	return $justinmimbs$date$Date$daysBeforeYear(y) + 1;
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.aD;
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $justinmimbs$date$Date$quarterToMonth = function (q) {
	return $justinmimbs$date$Date$numberToMonth((q * 3) - 2);
};
var $justinmimbs$date$Date$floor = F2(
	function (interval, date) {
		var rd = date;
		switch (interval) {
			case 0:
				return $justinmimbs$date$Date$firstOfYear(
					$justinmimbs$date$Date$year(date));
			case 1:
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$quarterToMonth(
						$justinmimbs$date$Date$quarter(date)));
			case 2:
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$month(date));
			case 3:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 4:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 5:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 1, date);
			case 6:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 2, date);
			case 7:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 3, date);
			case 8:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 4, date);
			case 9:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 5, date);
			case 10:
				return rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, 6, date);
			default:
				return date;
		}
	});
var $justinmimbs$date$Date$Days = 3;
var $justinmimbs$date$Date$Weeks = 2;
var $justinmimbs$date$Date$Years = 0;
var $justinmimbs$date$Date$intervalToUnits = function (interval) {
	switch (interval) {
		case 0:
			return _Utils_Tuple2(1, 0);
		case 1:
			return _Utils_Tuple2(3, 1);
		case 2:
			return _Utils_Tuple2(1, 1);
		case 11:
			return _Utils_Tuple2(1, 3);
		default:
			var week = interval;
			return _Utils_Tuple2(1, 2);
	}
};
var $justinmimbs$date$Date$ceiling = F2(
	function (interval, date) {
		var floored = A2($justinmimbs$date$Date$floor, interval, date);
		if (_Utils_eq(date, floored)) {
			return date;
		} else {
			var _v0 = $justinmimbs$date$Date$intervalToUnits(interval);
			var n = _v0.a;
			var unit = _v0.b;
			return A3($justinmimbs$date$Date$add, unit, n, floored);
		}
	});
var $author$project$Calendar$init = F3(
	function (zoom, selected, today) {
		return A6(
			$author$project$Calendar$Model,
			zoom,
			A2($justinmimbs$date$Date$floor, 1, selected),
			A2($justinmimbs$date$Date$ceiling, 1, selected),
			selected,
			today,
			true);
	});
var $author$project$Store$Model = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Store$State = function (activities) {
	return {ai: activities};
};
var $author$project$Store$init = function (activities) {
	return A2(
		$author$project$Store$Model,
		$author$project$Store$State(activities),
		_List_Nil);
};
var $author$project$Activity$Activity = F4(
	function (id, date, description, data) {
		return {T: data, an: date, ap: description, ay: id};
	});
var $author$project$Activity$Easy = 0;
var $author$project$Activity$Run = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $justinmimbs$date$Date$compare = F2(
	function (_v0, _v1) {
		var a = _v0;
		var b = _v1;
		return A2($elm$core$Basics$compare, a, b);
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $author$project$Activity$newId = function () {
	var digitsToString = function (digits) {
		return A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, $elm$core$String$fromInt, digits));
	};
	return A2(
		$elm$random$Random$map,
		digitsToString,
		A2(
			$elm$random$Random$list,
			10,
			A2($elm$random$Random$int, 0, 9)));
}();
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$initActivity = F2(
	function (today, dateM) {
		var date = A2($elm$core$Maybe$withDefault, today, dateM);
		var completed = (!A2($justinmimbs$date$Date$compare, date, today)) || _Utils_eq(date, today);
		return A2(
			$elm$random$Random$generate,
			$author$project$Msg$NewActivity,
			A2(
				$elm$random$Random$map,
				function (id) {
					return A4(
						$author$project$Activity$Activity,
						id,
						date,
						'',
						A3($author$project$Activity$Run, 30, 0, completed));
				},
				$author$project$Activity$newId));
	});
var $author$project$ActivityForm$initMove = function (activity) {
	var model = $author$project$ActivityForm$init(activity);
	return _Utils_update(
		model,
		{an: $elm$core$Maybe$Nothing});
};
var $author$project$Msg$Group = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$Activity$Session = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$initSession = F2(
	function (head, activities) {
		return A2(
			$elm$random$Random$generate,
			$author$project$Msg$Group(activities),
			A2(
				$elm$random$Random$map,
				function (id) {
					return A4(
						$author$project$Activity$Activity,
						id,
						head.an,
						'',
						$author$project$Activity$Session(activities));
				},
				$author$project$Activity$newId));
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $author$project$Main$loaded = function (stateTuple) {
	return A2($elm$core$Tuple$mapFirst, $author$project$Main$Loaded, stateTuple);
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Msg$Update = function (a) {
	return {$: 13, a: a};
};
var $author$project$ActivityForm$apply = F2(
	function (toMsg, _v0) {
		var result = _v0.L;
		if (!result.$) {
			var activity = result.a;
			return toMsg(activity);
		} else {
			return $author$project$Msg$NoOp;
		}
	});
var $author$project$Store$cmd = function (msg) {
	return A2(
		$elm$core$Task$perform,
		function (_v0) {
			return msg;
		},
		$elm$core$Task$succeed(0));
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$ActivityForm$updateCompleted = function (dataForm) {
	switch (dataForm.$) {
		case 0:
			var data = dataForm.a;
			return $author$project$Msg$RunForm(
				_Utils_update(
					data,
					{e: !data.e}));
		case 1:
			var data = dataForm.a;
			return $author$project$Msg$IntervalForm(
				_Utils_update(
					data,
					{e: !data.e}));
		case 2:
			var data = dataForm.a;
			return $author$project$Msg$RaceForm(
				_Utils_update(
					data,
					{e: !data.e}));
		case 3:
			var data = dataForm.a;
			return $author$project$Msg$OtherForm(
				_Utils_update(
					data,
					{e: !data.e}));
		default:
			return dataForm;
	}
};
var $author$project$ActivityForm$Defaults = F5(
	function (duration, pace, distance, completed, emoji) {
		return {e: completed, p: distance, f: duration, t: emoji, l: pace};
	});
var $author$project$Activity$FiveK = 0;
var $author$project$Emoji$EmojiData = F3(
	function (name, x, y) {
		return {aa: name, a1: x, a2: y};
	});
var $author$project$Emoji$default = A3($author$project$Emoji$EmojiData, 'smiley', 30, 38);
var $author$project$ActivityForm$parseDuration = function (str) {
	return $elm$core$String$isEmpty(str) ? 0 : A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$String$toInt(str));
};
var $author$project$ActivityForm$defaults = function (dataForm) {
	var pace_ = function () {
		if (!dataForm.$) {
			var pace = dataForm.a.l;
			return pace;
		} else {
			return 0;
		}
	}();
	var emoji_ = function () {
		if (dataForm.$ === 4) {
			var emoji = dataForm.a.t;
			return emoji;
		} else {
			return $author$project$Emoji$default.aa;
		}
	}();
	var duration_ = $author$project$ActivityForm$parseDuration(
		function () {
			switch (dataForm.$) {
				case 0:
					var duration = dataForm.a.f;
					return duration;
				case 2:
					var duration = dataForm.a.f;
					return duration;
				case 3:
					var duration = dataForm.a.f;
					return duration;
				default:
					return '30';
			}
		}());
	var distance_ = function () {
		if (dataForm.$ === 2) {
			var distance = dataForm.a.p;
			return distance;
		} else {
			return 0;
		}
	}();
	var completed_ = function () {
		switch (dataForm.$) {
			case 0:
				var completed = dataForm.a.e;
				return completed;
			case 2:
				var completed = dataForm.a.e;
				return completed;
			case 3:
				var completed = dataForm.a.e;
				return completed;
			default:
				return true;
		}
	}();
	return A5($author$project$ActivityForm$Defaults, duration_, pace_, distance_, completed_, emoji_);
};
var $author$project$Activity$EightK = 1;
var $author$project$Activity$FifteenK = 4;
var $author$project$Activity$FiveMile = 2;
var $author$project$Activity$HalfMarathon = 7;
var $author$project$Activity$Marathon = 10;
var $author$project$Activity$TenK = 3;
var $author$project$Activity$TenMile = 5;
var $author$project$Activity$ThirtyK = 9;
var $author$project$Activity$TwentyFiveK = 8;
var $author$project$Activity$TwentyK = 6;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Enum$create = F2(
	function (list, toStr) {
		var list2 = A2(
			$elm$core$List$map,
			function (a) {
				return _Utils_Tuple2(
					toStr(a),
					a);
			},
			list);
		var dict = $elm$core$Dict$fromList(list2);
		return {
			V: A2(
				$elm$json$Json$Decode$andThen,
				function (string) {
					var _v0 = A2($elm$core$Dict$get, string, dict);
					if (!_v0.$) {
						var a = _v0.a;
						return $elm$json$Json$Decode$succeed(a);
					} else {
						return $elm$json$Json$Decode$fail('Missing enum: ' + string);
					}
				},
				$elm$json$Json$Decode$string),
			aq: dict,
			W: A2($elm$core$Basics$composeR, toStr, $elm$json$Json$Encode$string),
			Y: function (string) {
				return A2($elm$core$Dict$get, string, dict);
			},
			Q: list2,
			bC: toStr
		};
	});
var $author$project$Activity$distance = A2(
	$author$project$Enum$create,
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
	function (a) {
		switch (a) {
			case 0:
				return '5k';
			case 1:
				return '8k';
			case 2:
				return '5 mile';
			case 3:
				return '10k';
			case 4:
				return '15k';
			case 5:
				return '10 mile';
			case 6:
				return '20k';
			case 7:
				return 'Half Marathon';
			case 8:
				return '25k';
			case 9:
				return '30k';
			default:
				return 'Marathon';
		}
	});
var $author$project$ActivityForm$updateDistance = F2(
	function (distanceStr, dataForm) {
		if (dataForm.$ === 2) {
			var data = dataForm.a;
			return $author$project$Msg$RaceForm(
				_Utils_update(
					data,
					{
						p: A2(
							$elm$core$Maybe$withDefault,
							$author$project$ActivityForm$defaults(dataForm).p,
							$author$project$Activity$distance.Y(distanceStr))
					}));
		} else {
			return dataForm;
		}
	});
var $author$project$ActivityForm$updateDuration = F2(
	function (duration, dataForm) {
		switch (dataForm.$) {
			case 0:
				var data = dataForm.a;
				return $author$project$Msg$RunForm(
					_Utils_update(
						data,
						{f: duration}));
			case 1:
				var data = dataForm.a;
				return $author$project$Msg$IntervalForm(
					_Utils_update(
						data,
						{f: duration}));
			case 2:
				var data = dataForm.a;
				return $author$project$Msg$RaceForm(
					_Utils_update(
						data,
						{f: duration}));
			case 3:
				var data = dataForm.a;
				return $author$project$Msg$OtherForm(
					_Utils_update(
						data,
						{f: duration}));
			default:
				return dataForm;
		}
	});
var $author$project$Activity$Aerobic = 4;
var $author$project$Activity$Brisk = 3;
var $author$project$Activity$Fast = 8;
var $author$project$Activity$Groove = 6;
var $author$project$Activity$Lactate = 5;
var $author$project$Activity$Moderate = 1;
var $author$project$Activity$Steady = 2;
var $author$project$Activity$VO2 = 7;
var $author$project$Activity$pace = A2(
	$author$project$Enum$create,
	_List_fromArray(
		[0, 1, 2, 3, 4, 5, 6, 7, 8]),
	function (a) {
		switch (a) {
			case 0:
				return 'Easy';
			case 1:
				return 'Moderate';
			case 2:
				return 'Steady';
			case 3:
				return 'Brisk';
			case 4:
				return 'Aerobic';
			case 5:
				return 'Lactate';
			case 6:
				return 'Groove';
			case 7:
				return 'VO2';
			default:
				return 'Fast';
		}
	});
var $author$project$ActivityForm$updatePace = F2(
	function (paceStr, dataForm) {
		switch (dataForm.$) {
			case 0:
				var data = dataForm.a;
				return $author$project$Msg$RunForm(
					_Utils_update(
						data,
						{
							l: A2(
								$elm$core$Maybe$withDefault,
								$author$project$ActivityForm$defaults(dataForm).l,
								$author$project$Activity$pace.Y(paceStr))
						}));
			case 1:
				var data = dataForm.a;
				return $author$project$Msg$IntervalForm(
					_Utils_update(
						data,
						{
							l: A2(
								$elm$core$Maybe$withDefault,
								$author$project$ActivityForm$defaults(dataForm).l,
								$author$project$Activity$pace.Y(paceStr))
						}));
			default:
				return dataForm;
		}
	});
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $author$project$Activity$Interval = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Activity$Note = function (a) {
	return {$: 4, a: a};
};
var $author$project$Activity$Other = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Activity$Race = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$ActivityForm$toActivityData = function (dataForm) {
	switch (dataForm.$) {
		case 0:
			var duration = dataForm.a.f;
			var pace = dataForm.a.l;
			var completed = dataForm.a.e;
			return A3(
				$author$project$Activity$Run,
				$author$project$ActivityForm$parseDuration(duration),
				pace,
				completed);
		case 1:
			var duration = dataForm.a.f;
			var pace = dataForm.a.l;
			var completed = dataForm.a.e;
			return A3(
				$author$project$Activity$Interval,
				$author$project$ActivityForm$parseDuration(duration),
				pace,
				completed);
		case 2:
			var duration = dataForm.a.f;
			var distance = dataForm.a.p;
			var completed = dataForm.a.e;
			return A3(
				$author$project$Activity$Race,
				$author$project$ActivityForm$parseDuration(duration),
				distance,
				completed);
		case 3:
			var duration = dataForm.a.f;
			var completed = dataForm.a.e;
			return A2(
				$author$project$Activity$Other,
				$author$project$ActivityForm$parseDuration(duration),
				completed);
		case 4:
			var emoji = dataForm.a.t;
			return $author$project$Activity$Note(emoji);
		default:
			var activities = dataForm.a;
			return $author$project$Activity$Session(activities);
	}
};
var $author$project$Msg$EmptyFieldError = function (a) {
	return {$: 1, a: a};
};
var $author$project$ActivityForm$validateFieldExists = F2(
	function (fieldM, fieldName) {
		if (!fieldM.$) {
			var field = fieldM.a;
			return $elm$core$Result$Ok(field);
		} else {
			return $elm$core$Result$Err(
				$author$project$Msg$EmptyFieldError(fieldName));
		}
	});
var $author$project$ActivityForm$validate = function (model) {
	return A3(
		$elm$core$Result$map2,
		F2(
			function (date, description) {
				return A4(
					$author$project$Activity$Activity,
					model.ay,
					date,
					description,
					$author$project$ActivityForm$toActivityData(model.g));
			}),
		A2($author$project$ActivityForm$validateFieldExists, model.an, 'date'),
		A2(
			$author$project$ActivityForm$validateFieldExists,
			$elm$core$Maybe$Just(model.ap),
			'description'));
};
var $author$project$ActivityForm$updateResult = function (model) {
	return _Utils_update(
		model,
		{
			L: $author$project$ActivityForm$validate(model)
		});
};
var $author$project$ActivityForm$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 29:
				var date = msg.a;
				var _v1 = model.an;
				if (_v1.$ === 1) {
					var newModel = $author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								an: $elm$core$Maybe$Just(date)
							}));
					return _Utils_Tuple2(
						newModel,
						$author$project$Store$cmd(
							A2(
								$author$project$ActivityForm$apply,
								$author$project$Msg$Move(date),
								newModel)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 30:
				var activityData = msg.a;
				switch (activityData.$) {
					case 0:
						var mins = activityData.a;
						var pace_ = activityData.b;
						var completed = activityData.c;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$RunForm(
											{
												e: completed,
												f: $elm$core$String$fromInt(mins),
												l: pace_
											})
									})),
							$elm$core$Platform$Cmd$none);
					case 1:
						var secs = activityData.a;
						var pace_ = activityData.b;
						var completed = activityData.c;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$IntervalForm(
											{
												e: completed,
												f: $elm$core$String$fromInt(secs),
												l: pace_
											})
									})),
							$elm$core$Platform$Cmd$none);
					case 2:
						var mins = activityData.a;
						var dist = activityData.b;
						var completed = activityData.c;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$RaceForm(
											{
												e: completed,
												p: dist,
												f: $elm$core$String$fromInt(mins)
											})
									})),
							$elm$core$Platform$Cmd$none);
					case 3:
						var mins = activityData.a;
						var completed = activityData.b;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$OtherForm(
											{
												e: completed,
												f: $elm$core$String$fromInt(mins)
											})
									})),
							$elm$core$Platform$Cmd$none);
					case 4:
						var emoji = activityData.a;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$NoteForm(
											{t: emoji})
									})),
							$elm$core$Platform$Cmd$none);
					default:
						var activities = activityData.a;
						return _Utils_Tuple2(
							$author$project$ActivityForm$updateResult(
								_Utils_update(
									model,
									{
										g: $author$project$Msg$SessionForm(activities)
									})),
							$elm$core$Platform$Cmd$none);
				}
			case 31:
				var desc = msg.a;
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{ap: desc})),
					$elm$core$Platform$Cmd$none);
			case 32:
				var _char = msg.a;
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								g: $author$project$Msg$NoteForm(
									{t: _char})
							})),
					$elm$core$Platform$Cmd$none);
			case 33:
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								g: $author$project$ActivityForm$updateCompleted(model.g)
							})),
					$elm$core$Platform$Cmd$none);
			case 34:
				var str = msg.a;
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								g: A2($author$project$ActivityForm$updateDuration, str, model.g)
							})),
					$elm$core$Platform$Cmd$none);
			case 35:
				var str = msg.a;
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								g: A2($author$project$ActivityForm$updatePace, str, model.g)
							})),
					$elm$core$Platform$Cmd$none);
			case 36:
				var str = msg.a;
				return _Utils_Tuple2(
					$author$project$ActivityForm$updateResult(
						_Utils_update(
							model,
							{
								g: A2($author$project$ActivityForm$updateDistance, str, model.g)
							})),
					$elm$core$Platform$Cmd$none);
			case 37:
				return _Utils_Tuple2(
					model,
					$author$project$Store$cmd(
						A2($author$project$ActivityForm$apply, $author$project$Msg$Update, model)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$updateActivityForm = F2(
	function (msg, _v0) {
		var calendar = _v0.a;
		var store = _v0.b;
		var activityM = _v0.c;
		var _v1 = function () {
			if (activityM.$ === 1) {
				var form = activityM.a;
				return A2(
					$elm$core$Tuple$mapFirst,
					$author$project$Msg$Editing,
					A2($author$project$ActivityForm$update, msg, form));
			} else {
				return _Utils_Tuple2(activityM, $elm$core$Platform$Cmd$none);
			}
		}();
		var newActivityM = _v1.a;
		var cmd = _v1.b;
		return _Utils_Tuple2(
			A3($author$project$Main$State, calendar, store, newActivityM),
			cmd);
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {am: col, ba: contextStack, aI: problem, aS: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.aS, s.am, x, s.c));
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{am: 1, c: s.c, d: s.d, b: s.b + 1, aS: s.aS + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{am: s.am + 1, c: s.c, d: s.d, b: newOffset, aS: s.aS, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $justinmimbs$date$Date$deadEndToString = function (_v0) {
	var problem = _v0.aI;
	if (problem.$ === 12) {
		var message = problem.a;
		return message;
	} else {
		return 'Expected a date in ISO 8601 format';
	}
};
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $justinmimbs$date$Date$MonthAndDay = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $justinmimbs$date$Date$OrdinalDay = function (a) {
	return {$: 2, a: a};
};
var $justinmimbs$date$Date$WeekAndWeekday = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$Advanced$commit = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, true, a, s);
	};
};
var $elm$parser$Parser$commit = $elm$parser$Parser$Advanced$commit;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$mapChompedString = $elm$parser$Parser$Advanced$mapChompedString;
var $justinmimbs$date$Date$int1 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$elm$parser$Parser$chompIf($elm$core$Char$isDigit));
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $justinmimbs$date$Date$int2 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(0),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $justinmimbs$date$Date$int3 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.aS, s.am, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{am: newCol, c: s.c, d: s.d, b: newOffset, aS: newRow, a: s.a});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $justinmimbs$date$Date$dayOfYear = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$token('-')),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$backtrackable(
						A2(
							$elm$parser$Parser$andThen,
							$elm$parser$Parser$commit,
							A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int2),
									$elm$parser$Parser$succeed(1)
								]))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
								$elm$parser$Parser$token('W')),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int1),
									$elm$parser$Parser$succeed(1)
								])))
					]))),
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$andThen,
				$elm$parser$Parser$commit,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
						$justinmimbs$date$Date$int2),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$justinmimbs$date$Date$int2,
								$elm$parser$Parser$succeed(1)
							]))))),
			A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
					$elm$parser$Parser$token('W')),
				$justinmimbs$date$Date$int2),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$justinmimbs$date$Date$int1,
						$elm$parser$Parser$succeed(1)
					]))),
			$elm$parser$Parser$succeed(
			$justinmimbs$date$Date$OrdinalDay(1))
		]));
var $justinmimbs$date$Date$isBetweenInt = F3(
	function (a, b, x) {
		return (_Utils_cmp(a, x) < 1) && (_Utils_cmp(x, b) < 1);
	});
var $justinmimbs$date$Date$fromCalendarParts = F3(
	function (y, mn, d) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 12, mn) && A3(
			$justinmimbs$date$Date$isBetweenInt,
			1,
			A2(
				$justinmimbs$date$Date$daysInMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn)),
			d)) ? $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2(
				$justinmimbs$date$Date$daysBeforeMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn))) + d) : $elm$core$Result$Err(
			'Invalid calendar date (' + ($elm$core$String$fromInt(y) + (', ' + ($elm$core$String$fromInt(mn) + (', ' + ($elm$core$String$fromInt(d) + ')'))))));
	});
var $justinmimbs$date$Date$fromOrdinalParts = F2(
	function (y, od) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 365, od) || ((od === 366) && $justinmimbs$date$Date$isLeapYear(y))) ? $elm$core$Result$Ok(
			$justinmimbs$date$Date$daysBeforeYear(y) + od) : $elm$core$Result$Err(
			'Invalid ordinal date (' + ($elm$core$String$fromInt(y) + (', ' + ($elm$core$String$fromInt(od) + ')'))));
	});
var $justinmimbs$date$Date$daysBeforeWeekYear = function (y) {
	var jan4 = $justinmimbs$date$Date$daysBeforeYear(y) + 4;
	return jan4 - $justinmimbs$date$Date$weekdayNumber(jan4);
};
var $justinmimbs$date$Date$is53WeekYear = function (y) {
	var wdnJan1 = $justinmimbs$date$Date$weekdayNumber(
		$justinmimbs$date$Date$firstOfYear(y));
	return (wdnJan1 === 4) || ((wdnJan1 === 3) && $justinmimbs$date$Date$isLeapYear(y));
};
var $justinmimbs$date$Date$fromWeekParts = F3(
	function (wy, wn, wdn) {
		return (A3($justinmimbs$date$Date$isBetweenInt, 1, 7, wdn) && (A3($justinmimbs$date$Date$isBetweenInt, 1, 52, wn) || ((wn === 53) && $justinmimbs$date$Date$is53WeekYear(wy)))) ? $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeWeekYear(wy) + ((wn - 1) * 7)) + wdn) : $elm$core$Result$Err(
			'Invalid week date (' + ($elm$core$String$fromInt(wy) + (', ' + ($elm$core$String$fromInt(wn) + (', ' + ($elm$core$String$fromInt(wdn) + ')'))))));
	});
var $justinmimbs$date$Date$fromYearAndDayOfYear = function (_v0) {
	var y = _v0.a;
	var doy = _v0.b;
	switch (doy.$) {
		case 0:
			var mn = doy.a;
			var d = doy.b;
			return A3($justinmimbs$date$Date$fromCalendarParts, y, mn, d);
		case 1:
			var wn = doy.a;
			var wdn = doy.b;
			return A3($justinmimbs$date$Date$fromWeekParts, y, wn, wdn);
		default:
			var od = doy.a;
			return A2($justinmimbs$date$Date$fromOrdinalParts, y, od);
	}
};
var $justinmimbs$date$Date$int4 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(0),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									$elm$parser$Parser$chompIf(
									function (c) {
										return c === '-';
									}),
									$elm$parser$Parser$succeed(0)
								]))),
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $justinmimbs$date$Date$resultToParser = function (result) {
	if (!result.$) {
		var x = result.a;
		return $elm$parser$Parser$succeed(x);
	} else {
		var message = result.a;
		return $elm$parser$Parser$problem(message);
	}
};
var $justinmimbs$date$Date$parser = A2(
	$elm$parser$Parser$andThen,
	A2($elm$core$Basics$composeR, $justinmimbs$date$Date$fromYearAndDayOfYear, $justinmimbs$date$Date$resultToParser),
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			$justinmimbs$date$Date$int4),
		$justinmimbs$date$Date$dayOfYear));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {am: col, aI: problem, aS: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.aS, p.am, p.aI);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{am: 1, c: _List_Nil, d: 1, b: 0, aS: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $justinmimbs$date$Date$fromIsoString = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run(
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			A2(
				$elm$parser$Parser$ignorer,
				$justinmimbs$date$Date$parser,
				A2(
					$elm$parser$Parser$andThen,
					$justinmimbs$date$Date$resultToParser,
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2($elm$parser$Parser$map, $elm$core$Result$Ok, $elm$parser$Parser$end),
								A2(
								$elm$parser$Parser$map,
								$elm$core$Basics$always(
									$elm$core$Result$Err('Expected a date only, not a date and time')),
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$eq('T'))),
								$elm$parser$Parser$succeed(
								$elm$core$Result$Err('Expected a date only'))
							])))))),
	$elm$core$Result$mapError(
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map($justinmimbs$date$Date$deadEndToString),
			$elm$core$String$join('; '))));
var $author$project$Msg$ScrollCompleted = function (a) {
	return {$: 22, a: a};
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Calendar$returnScroll = function (previousHeight) {
	return A2(
		$elm$core$Task$attempt,
		function (result) {
			return $author$project$Msg$ScrollCompleted(result);
		},
		A2(
			$elm$core$Task$andThen,
			function (_v0) {
				return $elm$browser$Browser$Dom$getElement('calendar');
			},
			A2(
				$elm$core$Task$andThen,
				function (info) {
					return $elm$core$Task$sequence(
						_List_fromArray(
							[
								A3($elm$browser$Browser$Dom$setViewportOf, 'calendar', 0, info.aT.u - previousHeight),
								$elm$core$Process$sleep(100),
								A3($elm$browser$Browser$Dom$setViewportOf, 'calendar', 0, info.aT.u - previousHeight)
							]));
				},
				$elm$browser$Browser$Dom$getViewportOf('calendar'))));
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Ports$scrollToSelectedDate = _Platform_outgoingPort(
	'scrollToSelectedDate',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Calendar$update = F2(
	function (msg, model) {
		var _v0 = model;
		var zoom = _v0.a;
		var start = _v0.b;
		var end = _v0.c;
		var selected = _v0.d;
		var today = _v0.e;
		var scrollCompleted = _v0.f;
		switch (msg.$) {
			case 0:
				var date = msg.a;
				return _Utils_Tuple2(
					A6($author$project$Calendar$Model, zoom, start, end, selected, date, scrollCompleted),
					$elm$core$Platform$Cmd$none);
			case 19:
				var date = msg.a;
				return _Utils_Tuple2(
					A3($author$project$Calendar$init, zoom, date, today),
					$author$project$Ports$scrollToSelectedDate(0));
			case 20:
				var newZoom = msg.a;
				var dateM = msg.b;
				return _Utils_Tuple2(
					A3(
						$author$project$Calendar$init,
						newZoom,
						A2($elm$core$Maybe$withDefault, selected, dateM),
						today),
					$author$project$Ports$scrollToSelectedDate(0));
			case 21:
				var up = msg.a;
				var date = msg.b;
				var currentHeight = msg.c;
				return (!scrollCompleted) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : (up ? _Utils_Tuple2(
					A6($author$project$Calendar$Model, zoom, date, end, selected, today, false),
					$author$project$Calendar$returnScroll(currentHeight)) : _Utils_Tuple2(
					A6($author$project$Calendar$Model, zoom, start, date, selected, today, scrollCompleted),
					$elm$core$Platform$Cmd$none));
			case 22:
				var result = msg.a;
				return _Utils_Tuple2(
					A6($author$project$Calendar$Model, zoom, start, end, selected, today, true),
					$elm$core$Platform$Cmd$none);
			case 23:
				var selectDate = msg.a;
				var newSelected = A2(
					$elm$core$Result$withDefault,
					selected,
					$justinmimbs$date$Date$fromIsoString(selectDate));
				return _Utils_eq(newSelected, selected) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					A6($author$project$Calendar$Model, zoom, start, end, newSelected, today, scrollCompleted),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$updateCalendar = F2(
	function (msg, _v0) {
		var calendar = _v0.a;
		var store = _v0.b;
		var activityM = _v0.c;
		return A2(
			$elm$core$Tuple$mapFirst,
			function (updated) {
				return A3($author$project$Main$State, updated, store, activityM);
			},
			A2($author$project$Calendar$update, msg, calendar));
	});
var $author$project$Msg$DebounceFlush = function (a) {
	return {$: 18, a: a};
};
var $author$project$Store$debounceFlush = function (length) {
	return A2(
		$elm$core$Task$perform,
		function (_v0) {
			return $author$project$Msg$DebounceFlush(length);
		},
		$elm$core$Process$sleep(5000));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Store$updateActivity = F3(
	function (activity, isNew, activities) {
		return isNew ? function (_v0) {
			var after = _v0.a;
			var before = _v0.b;
			return $elm$core$List$concat(
				_List_fromArray(
					[
						before,
						_List_fromArray(
						[activity]),
						after
					]));
		}(
			A2(
				$elm$core$List$partition,
				function (a) {
					return A2($justinmimbs$date$Date$compare, a.an, activity.an) === 2;
				},
				activities)) : A2(
			$elm$core$List$map,
			function (existing) {
				return _Utils_eq(existing.ay, activity.ay) ? activity : existing;
			},
			activities);
	});
var $author$project$Store$moveActivity = F3(
	function (activity, toDate, activities) {
		return A3(
			$author$project$Store$updateActivity,
			_Utils_update(
				activity,
				{an: toDate}),
			true,
			A2(
				$elm$core$List$filter,
				function (a) {
					return !_Utils_eq(a.ay, activity.ay);
				},
				activities));
	});
var $author$project$Store$shiftUp = F2(
	function (id, activities) {
		if (activities.b && activities.b.b) {
			var a = activities.a;
			var _v1 = activities.b;
			var b = _v1.a;
			var tail = _v1.b;
			return _Utils_eq(a.ay, id) ? activities : (_Utils_eq(b.ay, id) ? A2(
				$elm$core$List$cons,
				b,
				A2($elm$core$List$cons, a, tail)) : A2(
				$elm$core$List$cons,
				a,
				A2(
					$author$project$Store$shiftUp,
					id,
					A2($elm$core$List$cons, b, tail))));
		} else {
			return activities;
		}
	});
var $author$project$Store$shiftActivity = F3(
	function (activity, moveUp, activities) {
		var on = A2(
			$elm$core$List$filter,
			function (a) {
				return _Utils_eq(a.an, activity.an);
			},
			activities);
		var before = A2(
			$elm$core$List$filter,
			function (a) {
				return !A2($justinmimbs$date$Date$compare, a.an, activity.an);
			},
			activities);
		var after = A2(
			$elm$core$List$filter,
			function (a) {
				return A2($justinmimbs$date$Date$compare, a.an, activity.an) === 2;
			},
			activities);
		return moveUp ? $elm$core$List$concat(
			_List_fromArray(
				[
					before,
					A2($author$project$Store$shiftUp, activity.ay, on),
					after
				])) : $elm$core$List$concat(
			_List_fromArray(
				[
					before,
					$elm$core$List$reverse(
					A2(
						$author$project$Store$shiftUp,
						activity.ay,
						$elm$core$List$reverse(on))),
					after
				]));
	});
var $author$project$Store$updateState = F2(
	function (msg, state) {
		switch (msg.$) {
			case 10:
				var activity = msg.a;
				return _Utils_update(
					state,
					{
						ai: A3($author$project$Store$updateActivity, activity, true, state.ai)
					});
			case 11:
				var activities = msg.a;
				var session = msg.b;
				var ids = A2(
					$elm$core$List$map,
					function ($) {
						return $.ay;
					},
					activities);
				var removeActivities = A2(
					$elm$core$List$filter,
					function (a) {
						return !A2($elm$core$List$member, a.ay, ids);
					},
					state.ai);
				return _Utils_update(
					state,
					{
						ai: A3($author$project$Store$updateActivity, session, true, removeActivities)
					});
			case 12:
				var activities = msg.a;
				var session = msg.b;
				var ungrouped = A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3(
								$author$project$Store$updateActivity,
								_Utils_update(
									a,
									{an: session.an}),
								true,
								b);
						}),
					state.ai,
					activities);
				return _Utils_update(
					state,
					{
						ai: A2(
							$elm$core$List$filter,
							function (a) {
								return !_Utils_eq(a.ay, session.ay);
							},
							ungrouped)
					});
			case 13:
				var activity = msg.a;
				return _Utils_update(
					state,
					{
						ai: A3($author$project$Store$updateActivity, activity, false, state.ai)
					});
			case 14:
				var date = msg.a;
				var activity = msg.b;
				return _Utils_update(
					state,
					{
						ai: A3($author$project$Store$moveActivity, activity, date, state.ai)
					});
			case 15:
				var up = msg.a;
				var activity = msg.b;
				return _Utils_update(
					state,
					{
						ai: A3($author$project$Store$shiftActivity, activity, up, state.ai)
					});
			case 16:
				var activity = msg.a;
				return _Utils_update(
					state,
					{
						ai: A2(
							$elm$core$List$filter,
							function (a) {
								return !_Utils_eq(a.ay, activity.ay);
							},
							state.ai)
					});
			default:
				return state;
		}
	});
var $author$project$Store$update = F2(
	function (msg, _v0) {
		var state = _v0.a;
		var msgs = _v0.b;
		var model = A2($author$project$Store$Model, state, msgs);
		switch (msg.$) {
			case 17:
				var sentMsgs = msg.a;
				var result = msg.b;
				if ((!result.$) && result.a) {
					return _Utils_Tuple2(
						A2($author$project$Store$Model, state, msgs),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						A2(
							$author$project$Store$Model,
							state,
							_Utils_ap(msgs, sentMsgs)),
						$elm$core$Platform$Cmd$none);
				}
			case 18:
				var length = msg.a;
				return _Utils_eq(
					length,
					$elm$core$List$length(msgs)) ? _Utils_Tuple2(
					A2($author$project$Store$Model, state, _List_Nil),
					$author$project$Store$flush(model)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 2:
				var result = msg.a;
				if (!result.$) {
					var activities = result.a;
					var newState = A3(
						$elm$core$List$foldr,
						F2(
							function (rmsg, rs) {
								return A2($author$project$Store$updateState, rmsg, rs);
							}),
						$author$project$Store$State(activities),
						msgs);
					return _Utils_Tuple2(
						A2($author$project$Store$Model, newState, msgs),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(
					A2(
						$author$project$Store$Model,
						A2($author$project$Store$updateState, msg, state),
						A2($elm$core$List$cons, msg, msgs)),
					$author$project$Store$debounceFlush(
						$elm$core$List$length(msgs) + 1));
		}
	});
var $author$project$Main$updateStore = F2(
	function (msg, _v0) {
		var calendar = _v0.a;
		var store = _v0.b;
		var activityM = _v0.c;
		return A2(
			$elm$core$Tuple$mapFirst,
			function (updated) {
				return A3($author$project$Main$State, calendar, updated, activityM);
			},
			A2($author$project$Store$update, msg, store));
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (model.$) {
			case 0:
				var dateM = model.a;
				var activitiesM = model.b;
				switch (msg.$) {
					case 19:
						var date = msg.a;
						return $author$project$Main$updateLoading(
							A2(
								$author$project$Main$Loading,
								$elm$core$Maybe$Just(date),
								activitiesM));
					case 1:
						var activities = msg.a;
						return $author$project$Main$updateLoading(
							A2(
								$author$project$Main$Loading,
								dateM,
								$elm$core$Maybe$Just(activities)));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				var state = model.a;
				var _v3 = state;
				var calendar = _v3.a;
				var store = _v3.b;
				var activityM = _v3.c;
				switch (msg.$) {
					case 2:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateStore, msg, state));
					case 1:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 3:
						var visibility = msg.a;
						if (!visibility) {
							return _Utils_Tuple2(
								model,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											A2($elm$core$Task$perform, $author$project$Msg$LoadToday, $justinmimbs$date$Date$today)
										])));
						} else {
							return _Utils_Tuple2(
								model,
								$author$project$Store$flush(store));
						}
					case 4:
						var key = msg.a;
						if (key === 'Enter') {
							return $author$project$Main$loaded(
								A2($author$project$Main$updateActivityForm, $author$project$Msg$ClickedSubmit, state));
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					case 5:
						var x = msg.a;
						var y = msg.b;
						var newActivityM = function () {
							if (activityM.$ === 2) {
								var activity = activityM.a;
								return A3($author$project$Msg$Moving, activity, x, y);
							} else {
								return activityM;
							}
						}();
						return _Utils_Tuple2(
							$author$project$Main$Loaded(
								A3($author$project$Main$State, calendar, store, newActivityM)),
							$elm$core$Platform$Cmd$none);
					case 6:
						var y = msg.a;
						var navbarHeight = 50;
						var distance = 50;
						var autoScrollCalendar = A2(
							$elm$core$Task$andThen,
							function (info) {
								return (y < 0) ? $elm$core$Task$succeed(0) : ((_Utils_cmp(y, (info.S.u * 0.9) + navbarHeight) > 0) ? A3($elm$browser$Browser$Dom$setViewportOf, 'calendar', 0, info.S.a2 + distance) : ((_Utils_cmp(y, (info.S.u * 0.1) + navbarHeight) < 0) ? A3($elm$browser$Browser$Dom$setViewportOf, 'calendar', 0, info.S.a2 - distance) : $elm$core$Task$succeed(0)));
							},
							$elm$browser$Browser$Dom$getViewportOf('calendar'));
						return _Utils_Tuple2(
							model,
							A2(
								$elm$core$Task$attempt,
								function (_v8) {
									return $author$project$Msg$NoOp;
								},
								autoScrollCalendar));
					case 7:
						var newActivityM = function () {
							if (activityM.$ === 2) {
								var activity = activityM.a;
								return $author$project$Msg$Selected(
									_List_fromArray(
										[activity]));
							} else {
								return activityM;
							}
						}();
						return _Utils_Tuple2(
							$author$project$Main$Loaded(
								A3($author$project$Main$State, calendar, store, newActivityM)),
							$elm$core$Platform$Cmd$none);
					case 8:
						var date = msg.a;
						if (activityM.$ === 2) {
							var activity = activityM.a;
							var x = activityM.b;
							var y = activityM.c;
							if (_Utils_eq(activity.an, date)) {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							} else {
								var newActivityM = A3(
									$author$project$Msg$Moving,
									_Utils_update(
										activity,
										{an: date}),
									x,
									y);
								return $author$project$Main$loaded(
									A2(
										$author$project$Main$updateStore,
										A2($author$project$Msg$Move, date, activity),
										A3($author$project$Main$State, calendar, store, newActivityM)));
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					case 9:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 10:
						var activity = msg.a;
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								msg,
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Selected(
										_List_fromArray(
											[activity])))));
					case 11:
						var activities = msg.a;
						var session = msg.b;
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								msg,
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Selected(
										_List_fromArray(
											[session])))));
					case 12:
						var activities = msg.a;
						var session = msg.b;
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								msg,
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Selected(activities))));
					case 13:
						var activity = msg.a;
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								msg,
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Selected(
										_List_fromArray(
											[activity])))));
					case 14:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateStore, msg, state));
					case 15:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateStore, msg, state));
					case 16:
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								msg,
								A3($author$project$Main$State, calendar, store, $author$project$Msg$None)));
					case 17:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateStore, msg, state));
					case 18:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateStore, msg, state));
					case 0:
						var date = msg.a;
						return $author$project$Main$loaded(
							A2($author$project$Main$updateCalendar, msg, state));
					case 19:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateCalendar, msg, state));
					case 20:
						var zoom = msg.a;
						var dateM = msg.b;
						var _v11 = A2($author$project$Main$updateCalendar, msg, state);
						var calendarState = _v11.a;
						var calendarCmd = _v11.b;
						var _v12 = A2(
							$author$project$Main$updateActivityForm,
							A2(
								$elm$core$Maybe$withDefault,
								$author$project$Msg$NoOp,
								A2($elm$core$Maybe$map, $author$project$Msg$SelectedDate, dateM)),
							calendarState);
						var activityFormState = _v12.a;
						var activityFormCmd = _v12.b;
						return $author$project$Main$loaded(
							_Utils_Tuple2(
								activityFormState,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[calendarCmd, activityFormCmd]))));
					case 21:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateCalendar, msg, state));
					case 22:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateCalendar, msg, state));
					case 23:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateCalendar, msg, state));
					case 25:
						var date = msg.a;
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Main$initActivity,
								$author$project$Calendar$get(calendar).bD,
								$elm$core$Maybe$Just(date)));
					case 26:
						var activity = msg.a;
						var form = $author$project$ActivityForm$init(activity);
						return $author$project$Main$loaded(
							A2(
								$author$project$Main$updateStore,
								$author$project$Msg$Create(activity),
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Editing(form))));
					case 28:
						var activity = msg.a;
						var form = $author$project$ActivityForm$init(activity);
						return _Utils_Tuple2(
							$author$project$Main$Loaded(
								A3(
									$author$project$Main$State,
									calendar,
									store,
									$author$project$Msg$Editing(form))),
							$elm$core$Platform$Cmd$none);
					case 27:
						var activity = msg.a;
						var shiftKey = msg.b;
						var _v13 = _Utils_Tuple2(activityM, shiftKey);
						if ((!_v13.a.$) && _v13.b) {
							var selected = _v13.a.a;
							var indexedActivities = A2(
								$elm$core$List$indexedMap,
								$elm$core$Tuple$pair,
								A2(
									$elm$core$List$filter,
									function (a) {
										return _Utils_eq(a.an, activity.an);
									},
									A2(
										$author$project$Store$get,
										store,
										function ($) {
											return $.ai;
										})));
							var range = function (indexes) {
								return _Utils_Tuple2(
									$elm$core$List$minimum(indexes),
									$elm$core$List$maximum(indexes));
							}(
								$elm$core$List$unzip(
									A2(
										$elm$core$List$filter,
										function (_v16) {
											var a = _v16.b;
											return A2(
												$elm$core$List$member,
												a.ay,
												A2(
													$elm$core$List$map,
													function ($) {
														return $.ay;
													},
													A2($elm$core$List$cons, activity, selected)));
										},
										indexedActivities)).a);
							var list = function () {
								if ((!range.a.$) && (!range.b.$)) {
									var start = range.a.a;
									var end = range.b.a;
									return $elm$core$List$unzip(
										A2(
											$elm$core$List$filter,
											function (_v15) {
												var i = _v15.a;
												return (_Utils_cmp(i, start) > -1) && (_Utils_cmp(i, end) < 1);
											},
											indexedActivities)).b;
								} else {
									return _List_fromArray(
										[activity]);
								}
							}();
							return _Utils_Tuple2(
								$author$project$Main$Loaded(
									A3(
										$author$project$Main$State,
										calendar,
										store,
										$author$project$Msg$Selected(list))),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								$author$project$Main$Loaded(
									A3(
										$author$project$Main$State,
										calendar,
										store,
										$author$project$Msg$Selected(
											_List_fromArray(
												[activity])))),
								$elm$core$Platform$Cmd$none);
						}
					case 24:
						var activity = msg.a;
						return _Utils_Tuple2(
							$author$project$Main$Loaded(
								A3(
									$author$project$Main$State,
									calendar,
									store,
									A3($author$project$Msg$Moving, activity, -100, -100))),
							$elm$core$Platform$Cmd$none);
					case 29:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 30:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 31:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 32:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 33:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 34:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 35:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 36:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
					case 37:
						if (activityM.$ === 1) {
							var form = activityM.a;
							return $author$project$Main$loaded(
								A2($author$project$Main$updateActivityForm, msg, state));
						} else {
							return _Utils_Tuple2(
								$author$project$Main$Loaded(
									A3($author$project$Main$State, calendar, store, $author$project$Msg$None)),
								$elm$core$Platform$Cmd$none);
						}
					case 38:
						var activity = msg.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$random$Random$generate,
								$author$project$Msg$NewActivity,
								A2(
									$elm$random$Random$map,
									function (id) {
										return _Utils_update(
											activity,
											{ay: id});
									},
									$author$project$Activity$newId)));
					case 39:
						var activity = msg.a;
						var _v18 = A2(
							$author$project$Main$updateCalendar,
							A2($author$project$Msg$ChangeZoom, 0, $elm$core$Maybe$Nothing),
							A3(
								$author$project$Main$State,
								calendar,
								store,
								$author$project$Msg$Editing(
									$author$project$ActivityForm$initMove(activity))));
						var calendarState = _v18.a;
						var calendarCmd = _v18.b;
						var _v19 = A2($author$project$Main$updateActivityForm, msg, calendarState);
						var activityFormState = _v19.a;
						var activityFormCmd = _v19.b;
						return $author$project$Main$loaded(
							_Utils_Tuple2(
								activityFormState,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[calendarCmd, activityFormCmd]))));
					case 40:
						if ((!activityM.$) && activityM.a.b) {
							var _v21 = activityM.a;
							var a = _v21.a;
							var tail = _v21.b;
							return _Utils_Tuple2(
								model,
								A2(
									$author$project$Main$initSession,
									a,
									A2($elm$core$List$cons, a, tail)));
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					case 41:
						return _Utils_Tuple2(
							$author$project$Main$Loaded(
								A3($author$project$Main$State, calendar, store, $author$project$Msg$None)),
							$elm$core$Platform$Cmd$none);
					default:
						return $author$project$Main$loaded(
							A2($author$project$Main$updateActivityForm, msg, state));
				}
		}
	});
var $author$project$Main$updateLoading = function (model) {
	if (((!model.$) && (!model.a.$)) && (!model.b.$)) {
		var date = model.a.a;
		var activities = model.b.a;
		return A2(
			$author$project$Main$update,
			$author$project$Msg$Jump(date),
			$author$project$Main$Loaded(
				A3(
					$author$project$Main$State,
					A3($author$project$Calendar$init, 1, date, date),
					$author$project$Store$init(activities),
					$author$project$Msg$None)));
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Msg$LoadExampleActivities = function (a) {
	return {$: 1, a: a};
};
var $author$project$Msg$MouseReleased = {$: 7};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Skeleton$borderStyle = function (position) {
	return A2($elm$html$Html$Attributes$style, position, '1px solid var(--border-gray)');
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MPRLevel$Neutral = 0;
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$MPRData$aerobicRace = '\n{"5k":["0:28:00","0:27:45","0:27:30","0:27:15","0:27:00","0:26:45","0:26:30","0:26:15","0:26:00","0:25:45","0:25:30","0:25:15","0:25:00","0:24:45","0:24:30","0:24:15","0:24:00","0:23:45","0:23:30","0:23:15","0:23:00","0:22:45","0:22:30","0:22:15","0:22:00","0:21:45","0:21:30","0:21:15","0:21:00","0:20:45","0:20:30","0:20:15","0:20:00","0:19:45","0:19:30","0:19:15","0:19:00","0:18:45","0:18:30","0:18:15","0:18:00","0:17:45","0:17:30","0:17:15","0:17:00","0:16:45","0:16:30","0:16:15","0:16:00","0:15:45","0:15:30","0:15:15","0:15:00","0:14:45","0:14:30","0:14:15","0:14:00","0:13:45","0:13:30","0:13:15","0:13:00"],"8k":["0:45:53","0:45:28","0:45:03","0:44:39","0:44:14","0:43:50","0:43:25","0:43:00","0:42:36","0:42:11","0:41:47","0:41:22","0:40:58","0:40:33","0:40:08","0:39:44","0:39:19","0:38:55","0:38:30","0:38:06","0:37:41","0:37:16","0:36:52","0:36:27","0:36:03","0:35:38","0:35:14","0:34:49","0:34:24","0:34:00","0:33:35","0:33:11","0:32:46","0:32:22","0:31:57","0:31:32","0:31:08","0:30:43","0:30:19","0:29:54","0:29:29","0:29:05","0:28:40","0:28:16","0:27:51","0:27:27","0:27:02","0:26:37","0:26:13","0:25:48","0:25:24","0:24:59","0:24:35","0:24:10","0:23:45","0:23:21","0:22:56","0:22:32","0:22:07","0:21:43","0:21:18"],"5 mile":["0:46:09","0:45:44","0:45:19","0:44:55","0:44:30","0:44:05","0:43:40","0:43:16","0:42:51","0:42:26","0:42:01","0:41:37","0:41:12","0:40:47","0:40:23","0:39:58","0:39:33","0:39:08","0:38:44","0:38:19","0:37:54","0:37:30","0:37:05","0:36:40","0:36:15","0:35:51","0:35:26","0:35:01","0:34:37","0:34:12","0:33:47","0:33:22","0:32:58","0:32:33","0:32:08","0:31:43","0:31:19","0:30:54","0:30:29","0:30:05","0:29:40","0:29:15","0:28:50","0:28:26","0:28:01","0:27:36","0:27:12","0:26:47","0:26:22","0:25:57","0:25:33","0:25:08","0:24:43","0:24:19","0:23:54","0:23:29","0:23:04","0:22:40","0:22:15","0:21:50","0:21:25"],"10k":["0:58:14","0:57:43","0:57:12","0:56:41","0:56:10","0:55:38","0:55:07","0:54:36","0:54:05","0:53:34","0:53:02","0:52:31","0:52:00","0:51:29","0:50:58","0:50:26","0:49:55","0:49:24","0:48:53","0:48:22","0:47:50","0:47:19","0:46:48","0:46:17","0:45:46","0:45:14","0:44:43","0:44:12","0:43:41","0:43:10","0:42:38","0:42:07","0:41:36","0:41:05","0:40:34","0:40:02","0:39:31","0:39:00","0:38:29","0:37:58","0:37:26","0:36:55","0:36:24","0:35:53","0:35:22","0:34:50","0:34:19","0:33:48","0:33:17","0:32:46","0:32:14","0:31:43","0:31:12","0:30:41","0:30:10","0:29:38","0:29:07","0:28:36","0:28:05","0:27:34","0:27:02"],"15k":["1:29:06","1:28:19","1:27:31","1:26:43","1:25:55","1:25:08","1:24:20","1:23:32","1:22:45","1:21:57","1:21:09","1:20:21","1:19:34","1:18:46","1:17:58","1:17:10","1:16:23","1:15:35","1:14:47","1:13:59","1:13:12","1:12:24","1:11:36","1:10:49","1:10:01","1:09:13","1:08:25","1:07:38","1:06:50","1:06:02","1:05:14","1:04:27","1:03:39","1:02:51","1:02:03","1:01:16","1:00:28","0:59:40","0:58:52","0:58:05","0:57:17","0:56:29","0:55:42","0:54:54","0:54:06","0:53:18","0:52:31","0:51:43","0:50:55","0:50:07","0:49:20","0:48:32","0:47:44","0:46:56","0:46:09","0:45:21","0:44:33","0:43:45","0:42:58","0:42:10","0:41:22"],"10 mile":["1:35:59","1:35:07","1:34:16","1:33:25","1:32:33","1:31:42","1:30:50","1:29:59","1:29:08","1:28:16","1:27:25","1:26:33","1:25:42","1:24:50","1:23:59","1:23:08","1:22:16","1:21:25","1:20:33","1:19:42","1:18:50","1:17:59","1:17:08","1:16:16","1:15:25","1:14:33","1:13:42","1:12:51","1:11:59","1:11:08","1:10:16","1:09:25","1:08:33","1:07:42","1:06:51","1:05:59","1:05:08","1:04:16","1:03:25","1:02:34","1:01:42","1:00:51","0:59:59","0:59:08","0:58:16","0:57:25","0:56:34","0:55:42","0:54:51","0:53:59","0:53:08","0:52:17","0:51:25","0:50:34","0:49:42","0:48:51","0:47:59","0:47:08","0:46:17","0:45:25","0:44:34"],"20k":["2:01:08","2:00:03","1:58:59","1:57:54","1:56:49","1:55:44","1:54:39","1:53:34","1:52:29","1:51:24","1:50:19","1:49:14","1:48:10","1:47:05","1:46:00","1:44:55","1:43:50","1:42:45","1:41:40","1:40:35","1:39:30","1:38:26","1:37:21","1:36:16","1:35:11","1:34:06","1:33:01","1:31:56","1:30:51","1:29:46","1:28:41","1:27:37","1:26:32","1:25:27","1:24:22","1:23:17","1:22:12","1:21:07","1:20:02","1:18:57","1:17:53","1:16:48","1:15:43","1:14:38","1:13:33","1:12:28","1:11:23","1:10:18","1:09:13","1:08:08","1:07:04","1:05:59","1:04:54","1:03:49","1:02:44","1:01:39","1:00:34","0:59:29","0:58:24","0:57:19","0:56:15"],"Half Marathon":["2:08:19","2:07:11","2:06:02","2:04:53","2:03:44","2:02:36","2:01:27","2:00:18","1:59:09","1:58:01","1:56:52","1:55:43","1:54:34","1:53:26","1:52:17","1:51:08","1:49:59","1:48:51","1:47:42","1:46:33","1:45:25","1:44:16","1:43:07","1:41:58","1:40:50","1:39:41","1:38:32","1:37:23","1:36:15","1:35:06","1:33:57","1:32:48","1:31:40","1:30:31","1:29:22","1:28:13","1:27:05","1:25:56","1:24:47","1:23:38","1:22:30","1:21:21","1:20:12","1:19:03","1:17:55","1:16:46","1:15:37","1:14:28","1:13:20","1:12:11","1:11:02","1:09:53","1:08:45","1:07:36","1:06:27","1:05:18","1:04:10","1:03:01","1:01:52","1:00:43","0:59:35"],"25k":["2:32:56","2:31:34","2:30:12","2:28:51","2:27:29","2:26:07","2:24:45","2:23:23","2:22:01","2:20:39","2:19:17","2:17:55","2:16:33","2:15:11","2:13:49","2:12:27","2:11:05","2:09:43","2:08:22","2:07:00","2:05:38","2:04:16","2:02:54","2:01:32","2:00:10","1:58:48","1:57:26","1:56:04","1:54:42","1:53:20","1:51:58","1:50:36","1:49:14","1:47:53","1:46:31","1:45:09","1:43:47","1:42:25","1:41:03","1:39:41","1:38:19","1:36:57","1:35:35","1:34:13","1:32:51","1:31:29","1:30:07","1:28:46","1:27:24","1:26:02","1:24:40","1:23:18","1:21:56","1:20:34","1:19:12","1:17:50","1:16:28","1:15:06","1:13:44","1:12:22","1:11:00"],"30k":["3:05:21","3:03:41","3:02:02","3:00:23","2:58:43","2:57:04","2:55:25","2:53:46","2:52:06","2:50:27","2:48:48","2:47:08","2:45:29","2:43:50","2:42:11","2:40:31","2:38:52","2:37:13","2:35:33","2:33:54","2:32:15","2:30:35","2:28:56","2:27:17","2:25:38","2:23:58","2:22:19","2:20:40","2:19:00","2:17:21","2:15:42","2:14:03","2:12:23","2:10:44","2:09:05","2:07:25","2:05:46","2:04:07","2:02:28","2:00:48","1:59:09","1:57:30","1:55:50","1:54:11","1:52:32","1:50:52","1:49:13","1:47:34","1:45:55","1:44:15","1:42:36","1:40:57","1:39:17","1:37:38","1:35:59","1:34:20","1:32:40","1:31:01","1:29:22","1:27:42","1:26:03"],"Marathon":["4:26:25","4:24:02","4:21:39","4:19:17","4:16:54","4:14:31","4:12:08","4:09:46","4:07:23","4:05:00","4:02:38","4:00:15","3:57:52","3:55:29","3:53:07","3:50:44","3:48:21","3:45:59","3:43:36","3:41:13","3:38:50","3:36:28","3:34:05","3:31:42","3:29:19","3:26:57","3:24:34","3:22:11","3:19:49","3:17:26","3:15:03","3:12:40","3:10:18","3:07:55","3:05:32","3:03:10","3:00:47","2:58:24","2:56:01","2:53:39","2:51:16","2:48:53","2:46:30","2:44:08","2:41:45","2:39:22","2:37:00","2:34:37","2:32:14","2:29:51","2:27:29","2:25:06","2:22:43","2:20:21","2:17:58","2:15:35","2:13:12","2:10:50","2:08:27","2:06:04","2:03:41"]}\n';
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$MPRData$neutralRace = '\n{"5k":["0:28:00","0:27:45","0:27:30","0:27:15","0:27:00","0:26:45","0:26:30","0:26:15","0:26:00","0:25:45","0:25:30","0:25:15","0:25:00","0:24:45","0:24:30","0:24:15","0:24:00","0:23:45","0:23:30","0:23:15","0:23:00","0:22:45","0:22:30","0:22:15","0:22:00","0:21:45","0:21:30","0:21:15","0:21:00","0:20:45","0:20:30","0:20:15","0:20:00","0:19:45","0:19:30","0:19:15","0:19:00","0:18:45","0:18:30","0:18:15","0:18:00","0:17:45","0:17:30","0:17:15","0:17:00","0:16:45","0:16:30","0:16:15","0:16:00","0:15:45","0:15:30","0:15:15","0:15:00","0:14:45","0:14:30","0:14:15","0:14:00","0:13:45","0:13:30","0:13:15","0:13:00"],"8k":["0:46:01","0:45:36","0:45:11","0:44:47","0:44:22","0:43:57","0:43:33","0:43:08","0:42:43","0:42:19","0:41:54","0:41:29","0:41:05","0:40:40","0:40:16","0:39:51","0:39:26","0:39:02","0:38:37","0:38:12","0:37:48","0:37:23","0:36:58","0:36:34","0:36:09","0:35:44","0:35:20","0:34:55","0:34:30","0:34:06","0:33:41","0:33:16","0:32:52","0:32:27","0:32:03","0:31:38","0:31:13","0:30:49","0:30:24","0:29:59","0:29:35","0:29:10","0:28:45","0:28:21","0:27:56","0:27:31","0:27:07","0:26:42","0:26:17","0:25:53","0:25:28","0:25:04","0:24:39","0:24:14","0:23:50","0:23:25","0:23:00","0:22:36","0:22:11","0:21:46","0:21:22"],"5 mile":["0:46:17","0:45:52","0:45:27","0:45:02","0:44:38","0:44:13","0:43:48","0:43:23","0:42:58","0:42:34","0:42:09","0:41:44","0:41:19","0:40:54","0:40:30","0:40:05","0:39:40","0:39:15","0:38:51","0:38:26","0:38:01","0:37:36","0:37:11","0:36:47","0:36:22","0:35:57","0:35:32","0:35:07","0:34:43","0:34:18","0:33:53","0:33:28","0:33:03","0:32:39","0:32:14","0:31:49","0:31:24","0:30:59","0:30:35","0:30:10","0:29:45","0:29:20","0:28:55","0:28:31","0:28:06","0:27:41","0:27:16","0:26:52","0:26:27","0:26:02","0:25:37","0:25:12","0:24:48","0:24:23","0:23:58","0:23:33","0:23:08","0:22:44","0:22:19","0:21:54","0:21:29"],"10k":["0:58:31","0:58:00","0:57:28","0:56:57","0:56:26","0:55:54","0:55:23","0:54:52","0:54:20","0:53:49","0:53:18","0:52:46","0:52:15","0:51:44","0:51:12","0:50:41","0:50:10","0:49:38","0:49:07","0:48:36","0:48:04","0:47:33","0:47:01","0:46:30","0:45:59","0:45:27","0:44:56","0:44:25","0:43:53","0:43:22","0:42:51","0:42:19","0:41:48","0:41:17","0:40:45","0:40:14","0:39:43","0:39:11","0:38:40","0:38:09","0:37:37","0:37:06","0:36:34","0:36:03","0:35:32","0:35:00","0:34:29","0:33:58","0:33:26","0:32:55","0:32:24","0:31:52","0:31:21","0:30:50","0:30:18","0:29:47","0:29:16","0:28:44","0:28:13","0:27:42","0:27:10"],"15k":["1:29:45","1:28:57","1:28:09","1:27:21","1:26:33","1:25:45","1:24:57","1:24:09","1:23:21","1:22:33","1:21:44","1:20:56","1:20:08","1:19:20","1:18:32","1:17:44","1:16:56","1:16:08","1:15:20","1:14:32","1:13:44","1:12:56","1:12:07","1:11:19","1:10:31","1:09:43","1:08:55","1:08:07","1:07:19","1:06:31","1:05:43","1:04:55","1:04:07","1:03:19","1:02:30","1:01:42","1:00:54","1:00:06","0:59:18","0:58:30","0:57:42","0:56:54","0:56:06","0:55:18","0:54:30","0:53:42","0:52:53","0:52:05","0:51:17","0:50:29","0:49:41","0:48:53","0:48:05","0:47:17","0:46:29","0:45:41","0:44:53","0:44:05","0:43:16","0:42:28","0:41:40"],"10 mile":["1:36:44","1:35:52","1:35:00","1:34:08","1:33:16","1:32:24","1:31:33","1:30:41","1:29:49","1:28:57","1:28:05","1:27:14","1:26:22","1:25:30","1:24:38","1:23:46","1:22:54","1:22:03","1:21:11","1:20:19","1:19:27","1:18:35","1:17:44","1:16:52","1:16:00","1:15:08","1:14:16","1:13:24","1:12:33","1:11:41","1:10:49","1:09:57","1:09:05","1:08:14","1:07:22","1:06:30","1:05:38","1:04:46","1:03:54","1:03:03","1:02:11","1:01:19","1:00:27","0:59:35","0:58:44","0:57:52","0:57:00","0:56:08","0:55:16","0:54:24","0:53:33","0:52:41","0:51:49","0:50:57","0:50:05","0:49:14","0:48:22","0:47:30","0:46:38","0:45:46","0:44:54"],"20k":["2:02:18","2:01:13","2:00:07","1:59:02","1:57:56","1:56:51","1:55:45","1:54:40","1:53:34","1:52:29","1:51:23","1:50:18","1:49:12","1:48:07","1:47:01","1:45:56","1:44:50","1:43:45","1:42:39","1:41:33","1:40:28","1:39:22","1:38:17","1:37:11","1:36:06","1:35:00","1:33:55","1:32:49","1:31:44","1:30:38","1:29:33","1:28:27","1:27:22","1:26:16","1:25:11","1:24:05","1:23:00","1:21:54","1:20:49","1:19:43","1:18:38","1:17:32","1:16:27","1:15:21","1:14:15","1:13:10","1:12:04","1:10:59","1:09:53","1:08:48","1:07:42","1:06:37","1:05:31","1:04:26","1:03:20","1:02:15","1:01:09","1:00:04","0:58:58","0:57:53","0:56:47"],"Half Marathon":["2:09:38","2:08:28","2:07:19","2:06:09","2:05:00","2:03:50","2:02:41","2:01:32","2:00:22","1:59:13","1:58:03","1:56:54","1:55:44","1:54:35","1:53:25","1:52:16","1:51:07","1:49:57","1:48:48","1:47:38","1:46:29","1:45:19","1:44:10","1:43:00","1:41:51","1:40:42","1:39:32","1:38:23","1:37:13","1:36:04","1:34:54","1:33:45","1:32:35","1:31:26","1:30:17","1:29:07","1:27:58","1:26:48","1:25:39","1:24:29","1:23:20","1:22:10","1:21:01","1:19:52","1:18:42","1:17:33","1:16:23","1:15:14","1:14:04","1:12:55","1:11:46","1:10:36","1:09:27","1:08:17","1:07:08","1:05:58","1:04:49","1:03:39","1:02:30","1:01:21","1:00:11"],"25k":["2:34:36","2:33:13","2:31:51","2:30:28","2:29:05","2:27:42","2:26:19","2:24:56","2:23:34","2:22:11","2:20:48","2:19:25","2:18:02","2:16:40","2:15:17","2:13:54","2:12:31","2:11:08","2:09:45","2:08:23","2:07:00","2:05:37","2:04:14","2:02:51","2:01:28","2:00:06","1:58:43","1:57:20","1:55:57","1:54:34","1:53:12","1:51:49","1:50:26","1:49:03","1:47:40","1:46:17","1:44:55","1:43:32","1:42:09","1:40:46","1:39:23","1:38:00","1:36:38","1:35:15","1:33:52","1:32:29","1:31:06","1:29:44","1:28:21","1:26:58","1:25:35","1:24:12","1:22:49","1:21:27","1:20:04","1:18:41","1:17:18","1:15:55","1:14:32","1:13:10","1:11:47"],"30k":["3:07:35","3:05:55","3:04:14","3:02:34","3:00:53","2:59:13","2:57:32","2:55:52","2:54:11","2:52:31","2:50:50","2:49:10","2:47:29","2:45:49","2:44:08","2:42:28","2:40:47","2:39:07","2:37:26","2:35:46","2:34:05","2:32:25","2:30:44","2:29:04","2:27:23","2:25:43","2:24:02","2:22:22","2:20:41","2:19:01","2:17:20","2:15:40","2:13:59","2:12:19","2:10:39","2:08:58","2:07:18","2:05:37","2:03:57","2:02:16","2:00:36","1:58:55","1:57:15","1:55:34","1:53:54","1:52:13","1:50:33","1:48:52","1:47:12","1:45:31","1:43:51","1:42:10","1:40:30","1:38:49","1:37:09","1:35:28","1:33:48","1:32:07","1:30:27","1:28:46","1:27:06"],"Marathon":["4:30:21","4:27:56","4:25:31","4:23:06","4:20:42","4:18:17","4:15:52","4:13:27","4:11:02","4:08:37","4:06:13","4:03:48","4:01:23","3:58:58","3:56:33","3:54:08","3:51:44","3:49:19","3:46:54","3:44:29","3:42:04","3:39:39","3:37:15","3:34:50","3:32:25","3:30:00","3:27:35","3:25:10","3:22:46","3:20:21","3:17:56","3:15:31","3:13:06","3:10:42","3:08:17","3:05:52","3:03:27","3:01:02","2:58:37","2:56:13","2:53:48","2:51:23","2:48:58","2:46:33","2:44:08","2:41:44","2:39:19","2:36:54","2:34:29","2:32:04","2:29:39","2:27:15","2:24:50","2:22:25","2:20:00","2:17:35","2:15:10","2:12:46","2:10:21","2:07:56","2:05:31"]}\n';
var $author$project$MPRData$speedRace = '\n{"5k":["0:28:00","0:27:45","0:27:30","0:27:15","0:27:00","0:26:45","0:26:30","0:26:15","0:26:00","0:25:45","0:25:30","0:25:15","0:25:00","0:24:45","0:24:30","0:24:15","0:24:00","0:23:45","0:23:30","0:23:15","0:23:00","0:22:45","0:22:30","0:22:15","0:22:00","0:21:45","0:21:30","0:21:15","0:21:00","0:20:45","0:20:30","0:20:15","0:20:00","0:19:45","0:19:30","0:19:15","0:19:00","0:18:45","0:18:30","0:18:15","0:18:00","0:17:45","0:17:30","0:17:15","0:17:00","0:16:45","0:16:30","0:16:15","0:16:00","0:15:45","0:15:30","0:15:15","0:15:00","0:14:45","0:14:30","0:14:15","0:14:00","0:13:45","0:13:30","0:13:15","0:13:00"],"8k":["0:46:09","0:45:44","0:45:19","0:44:54","0:44:30","0:44:05","0:43:40","0:43:16","0:42:51","0:42:26","0:42:01","0:41:37","0:41:12","0:40:47","0:40:23","0:39:58","0:39:33","0:39:08","0:38:44","0:38:19","0:37:54","0:37:30","0:37:05","0:36:40","0:36:15","0:35:51","0:35:26","0:35:01","0:34:36","0:34:12","0:33:47","0:33:22","0:32:58","0:32:33","0:32:08","0:31:43","0:31:19","0:30:54","0:30:29","0:30:05","0:29:40","0:29:15","0:28:50","0:28:26","0:28:01","0:27:36","0:27:12","0:26:47","0:26:22","0:25:57","0:25:33","0:25:08","0:24:43","0:24:18","0:23:54","0:23:29","0:23:04","0:22:40","0:22:15","0:21:50","0:21:25"],"5 mile":["0:46:25","0:46:00","0:45:35","0:45:10","0:44:45","0:44:21","0:43:56","0:43:31","0:43:06","0:42:41","0:42:16","0:41:51","0:41:27","0:41:02","0:40:37","0:40:12","0:39:47","0:39:22","0:38:57","0:38:32","0:38:08","0:37:43","0:37:18","0:36:53","0:36:28","0:36:03","0:35:38","0:35:14","0:34:49","0:34:24","0:33:59","0:33:34","0:33:09","0:32:44","0:32:19","0:31:55","0:31:30","0:31:05","0:30:40","0:30:15","0:29:50","0:29:25","0:29:01","0:28:36","0:28:11","0:27:46","0:27:21","0:26:56","0:26:31","0:26:07","0:25:42","0:25:17","0:24:52","0:24:27","0:24:02","0:23:37","0:23:12","0:22:48","0:22:23","0:21:58","0:21:33"],"10k":["0:58:48","0:58:16","0:57:45","0:57:13","0:56:42","0:56:11","0:55:39","0:55:08","0:54:36","0:54:05","0:53:33","0:53:02","0:52:30","0:51:59","0:51:27","0:50:56","0:50:24","0:49:53","0:49:21","0:48:50","0:48:18","0:47:47","0:47:15","0:46:44","0:46:12","0:45:41","0:45:09","0:44:38","0:44:06","0:43:35","0:43:03","0:42:31","0:42:00","0:41:28","0:40:57","0:40:26","0:39:54","0:39:22","0:38:51","0:38:19","0:37:48","0:37:16","0:36:45","0:36:14","0:35:42","0:35:11","0:34:39","0:34:07","0:33:36","0:33:05","0:32:33","0:32:01","0:31:30","0:30:59","0:30:27","0:29:55","0:29:24","0:28:52","0:28:21","0:27:50","0:27:18"],"15k":["1:30:24","1:29:36","1:28:47","1:27:59","1:27:11","1:26:22","1:25:34","1:24:45","1:23:57","1:23:08","1:22:20","1:21:32","1:20:43","1:19:55","1:19:06","1:18:18","1:17:29","1:16:41","1:15:53","1:15:04","1:14:16","1:13:27","1:12:39","1:11:50","1:11:02","1:10:14","1:09:25","1:08:37","1:07:48","1:07:00","1:06:11","1:05:23","1:04:34","1:03:46","1:02:58","1:02:09","1:01:21","1:00:32","0:59:44","0:58:55","0:58:07","0:57:19","0:56:30","0:55:42","0:54:53","0:54:05","0:53:16","0:52:28","0:51:40","0:50:51","0:50:03","0:49:14","0:48:26","0:47:37","0:46:49","0:46:01","0:45:12","0:44:24","0:43:35","0:42:47","0:41:58"],"10 mile":["1:37:28","1:36:36","1:35:44","1:34:52","1:33:59","1:33:07","1:32:15","1:31:23","1:30:31","1:29:38","1:28:46","1:27:54","1:27:02","1:26:09","1:25:17","1:24:25","1:23:33","1:22:41","1:21:48","1:20:56","1:20:04","1:19:12","1:18:20","1:17:27","1:16:35","1:15:43","1:14:51","1:13:58","1:13:06","1:12:14","1:11:22","1:10:30","1:09:37","1:08:45","1:07:53","1:07:01","1:06:08","1:05:16","1:04:24","1:03:32","1:02:40","1:01:47","1:00:55","1:00:03","0:59:11","0:58:19","0:57:26","0:56:34","0:55:42","0:54:50","0:53:57","0:53:05","0:52:13","0:51:21","0:50:29","0:49:36","0:48:44","0:47:52","0:47:00","0:46:08","0:45:15"],"20k":["2:03:29","2:02:23","2:01:16","2:00:10","1:59:04","1:57:58","1:56:52","1:55:46","1:54:40","1:53:33","1:52:27","1:51:21","1:50:15","1:49:09","1:48:03","1:46:57","1:45:50","1:44:44","1:43:38","1:42:32","1:41:26","1:40:20","1:39:14","1:38:07","1:37:01","1:35:55","1:34:49","1:33:43","1:32:37","1:31:30","1:30:24","1:29:18","1:28:12","1:27:06","1:26:00","1:24:54","1:23:47","1:22:41","1:21:35","1:20:29","1:19:23","1:18:17","1:17:11","1:16:04","1:14:58","1:13:52","1:12:46","1:11:40","1:10:34","1:09:27","1:08:21","1:07:15","1:06:09","1:05:03","1:03:57","1:02:51","1:01:44","1:00:38","0:59:32","0:58:26","0:57:20"],"Half Marathon":["2:10:56","2:09:46","2:08:36","2:07:26","2:06:16","2:05:06","2:03:56","2:02:45","2:01:35","2:00:25","1:59:15","1:58:05","1:56:55","1:55:44","1:54:34","1:53:24","1:52:14","1:51:04","1:49:54","1:48:44","1:47:33","1:46:23","1:45:13","1:44:03","1:42:53","1:41:43","1:40:33","1:39:22","1:38:12","1:37:02","1:35:52","1:34:42","1:33:32","1:32:22","1:31:11","1:30:01","1:28:51","1:27:41","1:26:31","1:25:21","1:24:11","1:23:00","1:21:50","1:20:40","1:19:30","1:18:20","1:17:10","1:16:00","1:14:49","1:13:39","1:12:29","1:11:19","1:10:09","1:08:59","1:07:48","1:06:38","1:05:28","1:04:18","1:03:08","1:01:58","1:00:48"],"25k":["2:36:17","2:34:53","2:33:29","2:32:06","2:30:42","2:29:18","2:27:54","2:26:31","2:25:07","2:23:43","2:22:20","2:20:56","2:19:32","2:18:08","2:16:45","2:15:21","2:13:57","2:12:34","2:11:10","2:09:46","2:08:22","2:06:59","2:05:35","2:04:11","2:02:47","2:01:24","2:00:00","1:58:36","1:57:13","1:55:49","1:54:25","1:53:01","1:51:38","1:50:14","1:48:50","1:47:27","1:46:03","1:44:39","1:43:15","1:41:52","1:40:28","1:39:04","1:37:40","1:36:17","1:34:53","1:33:29","1:32:06","1:30:42","1:29:18","1:27:54","1:26:31","1:25:07","1:23:43","1:22:20","1:20:56","1:19:32","1:18:08","1:16:45","1:15:21","1:13:57","1:12:33"],"30k":["3:09:51","3:08:09","3:06:28","3:04:46","3:03:04","3:01:23","2:59:41","2:57:59","2:56:17","2:54:36","2:52:54","2:51:12","2:49:31","2:47:49","2:46:07","2:44:25","2:42:44","2:41:02","2:39:20","2:37:39","2:35:57","2:34:15","2:32:34","2:30:52","2:29:10","2:27:28","2:25:47","2:24:05","2:22:23","2:20:42","2:19:00","2:17:18","2:15:36","2:13:55","2:12:13","2:10:31","2:08:50","2:07:08","2:05:26","2:03:45","2:02:03","2:00:21","1:58:39","1:56:58","1:55:16","1:53:34","1:51:53","1:50:11","1:48:29","1:46:47","1:45:06","1:43:24","1:41:42","1:40:01","1:38:19","1:36:37","1:34:56","1:33:14","1:31:32","1:29:50","1:28:09"],"Marathon":["4:34:19","4:31:52","4:29:25","4:26:58","4:24:31","4:22:05","4:19:38","4:17:11","4:14:44","4:12:17","4:09:50","4:07:23","4:04:56","4:02:29","4:00:02","3:57:35","3:55:08","3:52:41","3:50:14","3:47:47","3:45:20","3:42:53","3:40:26","3:37:59","3:35:32","3:33:05","3:30:38","3:28:11","3:25:44","3:23:18","3:20:51","3:18:24","3:15:57","3:13:30","3:11:03","3:08:36","3:06:09","3:03:42","3:01:15","2:58:48","2:56:21","2:53:54","2:51:27","2:49:00","2:46:33","2:44:06","2:41:39","2:39:12","2:36:45","2:34:18","2:31:51","2:29:24","2:26:57","2:24:31","2:22:04","2:19:37","2:17:10","2:14:43","2:12:16","2:09:49","2:07:22"]}\n';
var $author$project$MPRLevel$equivalentRaceTimesTable = function (runnerType) {
	var json = function () {
		switch (runnerType) {
			case 0:
				return $author$project$MPRData$neutralRace;
			case 1:
				return $author$project$MPRData$aerobicRace;
			default:
				return $author$project$MPRData$speedRace;
		}
	}();
	return A2(
		$elm$core$Result$withDefault,
		$elm$core$Dict$empty,
		A2(
			$elm$json$Json$Decode$decodeString,
			$elm$json$Json$Decode$dict(
				$elm$json$Json$Decode$array($elm$json$Json$Decode$string)),
			json));
};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$MPRLevel$timeStrToHrsMinsSecs = function (str) {
	return A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$toInt,
			$elm$core$Maybe$withDefault(0)),
		A2($elm$core$String$split, ':', str));
};
var $author$project$MPRLevel$timeToSeconds = F3(
	function (hours, minutes, seconds) {
		return (((hours * 60) * 60) + (minutes * 60)) + seconds;
	});
var $author$project$MPRLevel$timeStrToSeconds = function (str) {
	var times = $author$project$MPRLevel$timeStrToHrsMinsSecs(str);
	if (((times.b && times.b.b) && times.b.b.b) && (!times.b.b.b.b)) {
		var hours = times.a;
		var _v1 = times.b;
		var minutes = _v1.a;
		var _v2 = _v1.b;
		var seconds = _v2.a;
		return $elm$core$Result$Ok(
			A3($author$project$MPRLevel$timeToSeconds, hours, minutes, seconds));
	} else {
		return $elm$core$Result$Err('Invalid time: ' + str);
	}
};
var $author$project$MPRLevel$lookup = F3(
	function (runnerType, distance, seconds) {
		return A2(
			$elm$core$Result$andThen,
			function (l) {
				return (l === 61) ? $elm$core$Result$Err('That time is too fast!') : ((!l) ? $elm$core$Result$Err('That time is too slow!') : $elm$core$Result$Ok(
					_Utils_Tuple2(runnerType, l)));
			},
			A2(
				$elm$core$Result$andThen,
				A2($elm$core$Basics$composeR, $elm$core$List$length, $elm$core$Result$Ok),
				A2(
					$elm$core$Result$andThen,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$filter(
							function (n) {
								return _Utils_cmp(n, seconds) > 0;
							}),
						$elm$core$Result$Ok),
					A2(
						$elm$core$Result$andThen,
						A2(
							$elm$core$Array$foldr,
							$elm$core$Result$map2($elm$core$List$cons),
							$elm$core$Result$Ok(_List_Nil)),
						A2(
							$elm$core$Result$andThen,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Array$map($author$project$MPRLevel$timeStrToSeconds),
								$elm$core$Result$Ok),
							A2(
								$elm$core$Result$fromMaybe,
								'Invalid distance: ' + distance,
								A2(
									$elm$core$Dict$get,
									distance,
									$author$project$MPRLevel$equivalentRaceTimesTable(runnerType))))))));
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Activity$mprLevel = function (activity) {
	var _v0 = activity.T;
	if (_v0.$ === 2) {
		var minutes = _v0.a;
		var distance_ = _v0.b;
		return $elm$core$Result$toMaybe(
			A2(
				$elm$core$Result$map,
				function (_v1) {
					var rt = _v1.a;
					var level = _v1.b;
					return level;
				},
				A3(
					$author$project$MPRLevel$lookup,
					0,
					$author$project$Activity$distance.bC(distance_),
					minutes * 60)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$calculateLevel = function (activities) {
	return $elm$core$List$head(
		$elm$core$List$reverse(
			A2($elm$core$List$filterMap, $author$project$Activity$mprLevel, activities)));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $elm$virtual_dom$VirtualDom$lazy4 = _VirtualDom_lazy4;
var $elm$html$Html$Lazy$lazy4 = $elm$virtual_dom$VirtualDom$lazy4;
var $author$project$Msg$MouseMoved = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Main$mouseMoveDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Msg$MouseMoved,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$float));
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $justinmimbs$date$Date$toRataDie = function (_v0) {
	var rd = _v0;
	return rd;
};
var $author$project$Msg$EditedDescription = function (a) {
	return {$: 31, a: a};
};
var $author$project$Msg$EditedDuration = function (a) {
	return {$: 34, a: a};
};
var $author$project$Msg$SelectedDistance = function (a) {
	return {$: 36, a: a};
};
var $author$project$Msg$SelectedEmoji = function (a) {
	return {$: 32, a: a};
};
var $author$project$Msg$SelectedPace = function (a) {
	return {$: 35, a: a};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $author$project$Skeleton$compactColumn = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('column compact'),
				attributes),
			children);
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $author$project$ActivityForm$distanceSelect = F2(
	function (msg, distance) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown medium')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button medium')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Activity$distance.bC(distance))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-content')
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var distanceOpt = _v0.a;
							return A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										msg(distanceOpt)),
										A2($elm$html$Html$Attributes$style, 'text-align', 'left')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(distanceOpt)
									]));
						},
						$author$project$Activity$distance.Q))
				]));
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$ActivityForm$durationInput = F3(
	function (msg, isSeconds, duration) {
		return A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('number'),
					$elm$html$Html$Attributes$placeholder(
					isSeconds ? 'Secs' : 'Mins'),
					$elm$html$Html$Events$onInput(msg),
					$elm$html$Html$Events$onFocus(
					msg('')),
					$elm$html$Html$Attributes$name('duration'),
					A2($elm$html$Html$Attributes$style, 'width', '3rem'),
					$elm$html$Html$Attributes$class('input small'),
					$elm$html$Html$Attributes$value(duration)
				]),
			_List_Nil);
	});
var $author$project$Emoji$list = _List_fromArray(
	[
		A3($author$project$Emoji$EmojiData, 'hash', 0, 0),
		A3($author$project$Emoji$EmojiData, 'keycap star', 0, 1),
		A3($author$project$Emoji$EmojiData, 'zero', 0, 2),
		A3($author$project$Emoji$EmojiData, 'one', 0, 3),
		A3($author$project$Emoji$EmojiData, 'two', 0, 4),
		A3($author$project$Emoji$EmojiData, 'three', 0, 5),
		A3($author$project$Emoji$EmojiData, 'four', 0, 6),
		A3($author$project$Emoji$EmojiData, 'five', 0, 7),
		A3($author$project$Emoji$EmojiData, 'six', 0, 8),
		A3($author$project$Emoji$EmojiData, 'seven', 0, 9),
		A3($author$project$Emoji$EmojiData, 'eight', 0, 10),
		A3($author$project$Emoji$EmojiData, 'nine', 0, 11),
		A3($author$project$Emoji$EmojiData, 'copyright', 0, 12),
		A3($author$project$Emoji$EmojiData, 'registered', 0, 13),
		A3($author$project$Emoji$EmojiData, 'mahjong', 0, 14),
		A3($author$project$Emoji$EmojiData, 'black joker', 0, 15),
		A3($author$project$Emoji$EmojiData, 'a', 0, 16),
		A3($author$project$Emoji$EmojiData, 'b', 0, 17),
		A3($author$project$Emoji$EmojiData, 'o2', 0, 18),
		A3($author$project$Emoji$EmojiData, 'parking', 0, 19),
		A3($author$project$Emoji$EmojiData, 'ab', 0, 20),
		A3($author$project$Emoji$EmojiData, 'cl', 0, 21),
		A3($author$project$Emoji$EmojiData, 'cool', 0, 22),
		A3($author$project$Emoji$EmojiData, 'free', 0, 23),
		A3($author$project$Emoji$EmojiData, 'id', 0, 24),
		A3($author$project$Emoji$EmojiData, 'new', 0, 25),
		A3($author$project$Emoji$EmojiData, 'ng', 0, 26),
		A3($author$project$Emoji$EmojiData, 'ok', 0, 27),
		A3($author$project$Emoji$EmojiData, 'sos', 0, 28),
		A3($author$project$Emoji$EmojiData, 'up', 0, 29),
		A3($author$project$Emoji$EmojiData, 'vs', 0, 30),
		A3($author$project$Emoji$EmojiData, 'flag ac', 0, 31),
		A3($author$project$Emoji$EmojiData, 'flag ad', 0, 32),
		A3($author$project$Emoji$EmojiData, 'flag ae', 0, 33),
		A3($author$project$Emoji$EmojiData, 'flag af', 0, 34),
		A3($author$project$Emoji$EmojiData, 'flag ag', 0, 35),
		A3($author$project$Emoji$EmojiData, 'flag ai', 0, 36),
		A3($author$project$Emoji$EmojiData, 'flag al', 0, 37),
		A3($author$project$Emoji$EmojiData, 'flag am', 0, 38),
		A3($author$project$Emoji$EmojiData, 'flag ao', 0, 39),
		A3($author$project$Emoji$EmojiData, 'flag aq', 0, 40),
		A3($author$project$Emoji$EmojiData, 'flag ar', 0, 41),
		A3($author$project$Emoji$EmojiData, 'flag as', 0, 42),
		A3($author$project$Emoji$EmojiData, 'flag at', 0, 43),
		A3($author$project$Emoji$EmojiData, 'flag au', 0, 44),
		A3($author$project$Emoji$EmojiData, 'flag aw', 0, 45),
		A3($author$project$Emoji$EmojiData, 'flag ax', 0, 46),
		A3($author$project$Emoji$EmojiData, 'flag az', 0, 47),
		A3($author$project$Emoji$EmojiData, 'flag ba', 0, 48),
		A3($author$project$Emoji$EmojiData, 'flag bb', 0, 49),
		A3($author$project$Emoji$EmojiData, 'flag bd', 0, 50),
		A3($author$project$Emoji$EmojiData, 'flag be', 0, 51),
		A3($author$project$Emoji$EmojiData, 'flag bf', 0, 52),
		A3($author$project$Emoji$EmojiData, 'flag bg', 0, 53),
		A3($author$project$Emoji$EmojiData, 'flag bh', 0, 54),
		A3($author$project$Emoji$EmojiData, 'flag bi', 0, 55),
		A3($author$project$Emoji$EmojiData, 'flag bj', 0, 56),
		A3($author$project$Emoji$EmojiData, 'flag bl', 1, 0),
		A3($author$project$Emoji$EmojiData, 'flag bm', 1, 1),
		A3($author$project$Emoji$EmojiData, 'flag bn', 1, 2),
		A3($author$project$Emoji$EmojiData, 'flag bo', 1, 3),
		A3($author$project$Emoji$EmojiData, 'flag bq', 1, 4),
		A3($author$project$Emoji$EmojiData, 'flag br', 1, 5),
		A3($author$project$Emoji$EmojiData, 'flag bs', 1, 6),
		A3($author$project$Emoji$EmojiData, 'flag bt', 1, 7),
		A3($author$project$Emoji$EmojiData, 'flag bv', 1, 8),
		A3($author$project$Emoji$EmojiData, 'flag bw', 1, 9),
		A3($author$project$Emoji$EmojiData, 'flag by', 1, 10),
		A3($author$project$Emoji$EmojiData, 'flag bz', 1, 11),
		A3($author$project$Emoji$EmojiData, 'flag ca', 1, 12),
		A3($author$project$Emoji$EmojiData, 'flag cc', 1, 13),
		A3($author$project$Emoji$EmojiData, 'flag cd', 1, 14),
		A3($author$project$Emoji$EmojiData, 'flag cf', 1, 15),
		A3($author$project$Emoji$EmojiData, 'flag cg', 1, 16),
		A3($author$project$Emoji$EmojiData, 'flag ch', 1, 17),
		A3($author$project$Emoji$EmojiData, 'flag ci', 1, 18),
		A3($author$project$Emoji$EmojiData, 'flag ck', 1, 19),
		A3($author$project$Emoji$EmojiData, 'flag cl', 1, 20),
		A3($author$project$Emoji$EmojiData, 'flag cm', 1, 21),
		A3($author$project$Emoji$EmojiData, 'cn', 1, 22),
		A3($author$project$Emoji$EmojiData, 'flag co', 1, 23),
		A3($author$project$Emoji$EmojiData, 'flag cp', 1, 24),
		A3($author$project$Emoji$EmojiData, 'flag cr', 1, 25),
		A3($author$project$Emoji$EmojiData, 'flag cu', 1, 26),
		A3($author$project$Emoji$EmojiData, 'flag cv', 1, 27),
		A3($author$project$Emoji$EmojiData, 'flag cw', 1, 28),
		A3($author$project$Emoji$EmojiData, 'flag cx', 1, 29),
		A3($author$project$Emoji$EmojiData, 'flag cy', 1, 30),
		A3($author$project$Emoji$EmojiData, 'flag cz', 1, 31),
		A3($author$project$Emoji$EmojiData, 'de', 1, 32),
		A3($author$project$Emoji$EmojiData, 'flag dg', 1, 33),
		A3($author$project$Emoji$EmojiData, 'flag dj', 1, 34),
		A3($author$project$Emoji$EmojiData, 'flag dk', 1, 35),
		A3($author$project$Emoji$EmojiData, 'flag dm', 1, 36),
		A3($author$project$Emoji$EmojiData, 'flag do', 1, 37),
		A3($author$project$Emoji$EmojiData, 'flag dz', 1, 38),
		A3($author$project$Emoji$EmojiData, 'flag ea', 1, 39),
		A3($author$project$Emoji$EmojiData, 'flag ec', 1, 40),
		A3($author$project$Emoji$EmojiData, 'flag ee', 1, 41),
		A3($author$project$Emoji$EmojiData, 'flag eg', 1, 42),
		A3($author$project$Emoji$EmojiData, 'flag eh', 1, 43),
		A3($author$project$Emoji$EmojiData, 'flag er', 1, 44),
		A3($author$project$Emoji$EmojiData, 'es', 1, 45),
		A3($author$project$Emoji$EmojiData, 'flag et', 1, 46),
		A3($author$project$Emoji$EmojiData, 'flag eu', 1, 47),
		A3($author$project$Emoji$EmojiData, 'flag fi', 1, 48),
		A3($author$project$Emoji$EmojiData, 'flag fj', 1, 49),
		A3($author$project$Emoji$EmojiData, 'flag fk', 1, 50),
		A3($author$project$Emoji$EmojiData, 'flag fm', 1, 51),
		A3($author$project$Emoji$EmojiData, 'flag fo', 1, 52),
		A3($author$project$Emoji$EmojiData, 'fr', 1, 53),
		A3($author$project$Emoji$EmojiData, 'flag ga', 1, 54),
		A3($author$project$Emoji$EmojiData, 'gb', 1, 55),
		A3($author$project$Emoji$EmojiData, 'flag gd', 1, 56),
		A3($author$project$Emoji$EmojiData, 'flag ge', 2, 0),
		A3($author$project$Emoji$EmojiData, 'flag gf', 2, 1),
		A3($author$project$Emoji$EmojiData, 'flag gg', 2, 2),
		A3($author$project$Emoji$EmojiData, 'flag gh', 2, 3),
		A3($author$project$Emoji$EmojiData, 'flag gi', 2, 4),
		A3($author$project$Emoji$EmojiData, 'flag gl', 2, 5),
		A3($author$project$Emoji$EmojiData, 'flag gm', 2, 6),
		A3($author$project$Emoji$EmojiData, 'flag gn', 2, 7),
		A3($author$project$Emoji$EmojiData, 'flag gp', 2, 8),
		A3($author$project$Emoji$EmojiData, 'flag gq', 2, 9),
		A3($author$project$Emoji$EmojiData, 'flag gr', 2, 10),
		A3($author$project$Emoji$EmojiData, 'flag gs', 2, 11),
		A3($author$project$Emoji$EmojiData, 'flag gt', 2, 12),
		A3($author$project$Emoji$EmojiData, 'flag gu', 2, 13),
		A3($author$project$Emoji$EmojiData, 'flag gw', 2, 14),
		A3($author$project$Emoji$EmojiData, 'flag gy', 2, 15),
		A3($author$project$Emoji$EmojiData, 'flag hk', 2, 16),
		A3($author$project$Emoji$EmojiData, 'flag hm', 2, 17),
		A3($author$project$Emoji$EmojiData, 'flag hn', 2, 18),
		A3($author$project$Emoji$EmojiData, 'flag hr', 2, 19),
		A3($author$project$Emoji$EmojiData, 'flag ht', 2, 20),
		A3($author$project$Emoji$EmojiData, 'flag hu', 2, 21),
		A3($author$project$Emoji$EmojiData, 'flag ic', 2, 22),
		A3($author$project$Emoji$EmojiData, 'flag id', 2, 23),
		A3($author$project$Emoji$EmojiData, 'flag ie', 2, 24),
		A3($author$project$Emoji$EmojiData, 'flag il', 2, 25),
		A3($author$project$Emoji$EmojiData, 'flag im', 2, 26),
		A3($author$project$Emoji$EmojiData, 'flag in', 2, 27),
		A3($author$project$Emoji$EmojiData, 'flag io', 2, 28),
		A3($author$project$Emoji$EmojiData, 'flag iq', 2, 29),
		A3($author$project$Emoji$EmojiData, 'flag ir', 2, 30),
		A3($author$project$Emoji$EmojiData, 'flag is', 2, 31),
		A3($author$project$Emoji$EmojiData, 'it', 2, 32),
		A3($author$project$Emoji$EmojiData, 'flag je', 2, 33),
		A3($author$project$Emoji$EmojiData, 'flag jm', 2, 34),
		A3($author$project$Emoji$EmojiData, 'flag jo', 2, 35),
		A3($author$project$Emoji$EmojiData, 'jp', 2, 36),
		A3($author$project$Emoji$EmojiData, 'flag ke', 2, 37),
		A3($author$project$Emoji$EmojiData, 'flag kg', 2, 38),
		A3($author$project$Emoji$EmojiData, 'flag kh', 2, 39),
		A3($author$project$Emoji$EmojiData, 'flag ki', 2, 40),
		A3($author$project$Emoji$EmojiData, 'flag km', 2, 41),
		A3($author$project$Emoji$EmojiData, 'flag kn', 2, 42),
		A3($author$project$Emoji$EmojiData, 'flag kp', 2, 43),
		A3($author$project$Emoji$EmojiData, 'kr', 2, 44),
		A3($author$project$Emoji$EmojiData, 'flag kw', 2, 45),
		A3($author$project$Emoji$EmojiData, 'flag ky', 2, 46),
		A3($author$project$Emoji$EmojiData, 'flag kz', 2, 47),
		A3($author$project$Emoji$EmojiData, 'flag la', 2, 48),
		A3($author$project$Emoji$EmojiData, 'flag lb', 2, 49),
		A3($author$project$Emoji$EmojiData, 'flag lc', 2, 50),
		A3($author$project$Emoji$EmojiData, 'flag li', 2, 51),
		A3($author$project$Emoji$EmojiData, 'flag lk', 2, 52),
		A3($author$project$Emoji$EmojiData, 'flag lr', 2, 53),
		A3($author$project$Emoji$EmojiData, 'flag ls', 2, 54),
		A3($author$project$Emoji$EmojiData, 'flag lt', 2, 55),
		A3($author$project$Emoji$EmojiData, 'flag lu', 2, 56),
		A3($author$project$Emoji$EmojiData, 'flag lv', 3, 0),
		A3($author$project$Emoji$EmojiData, 'flag ly', 3, 1),
		A3($author$project$Emoji$EmojiData, 'flag ma', 3, 2),
		A3($author$project$Emoji$EmojiData, 'flag mc', 3, 3),
		A3($author$project$Emoji$EmojiData, 'flag md', 3, 4),
		A3($author$project$Emoji$EmojiData, 'flag me', 3, 5),
		A3($author$project$Emoji$EmojiData, 'flag mf', 3, 6),
		A3($author$project$Emoji$EmojiData, 'flag mg', 3, 7),
		A3($author$project$Emoji$EmojiData, 'flag mh', 3, 8),
		A3($author$project$Emoji$EmojiData, 'flag mk', 3, 9),
		A3($author$project$Emoji$EmojiData, 'flag ml', 3, 10),
		A3($author$project$Emoji$EmojiData, 'flag mm', 3, 11),
		A3($author$project$Emoji$EmojiData, 'flag mn', 3, 12),
		A3($author$project$Emoji$EmojiData, 'flag mo', 3, 13),
		A3($author$project$Emoji$EmojiData, 'flag mp', 3, 14),
		A3($author$project$Emoji$EmojiData, 'flag mq', 3, 15),
		A3($author$project$Emoji$EmojiData, 'flag mr', 3, 16),
		A3($author$project$Emoji$EmojiData, 'flag ms', 3, 17),
		A3($author$project$Emoji$EmojiData, 'flag mt', 3, 18),
		A3($author$project$Emoji$EmojiData, 'flag mu', 3, 19),
		A3($author$project$Emoji$EmojiData, 'flag mv', 3, 20),
		A3($author$project$Emoji$EmojiData, 'flag mw', 3, 21),
		A3($author$project$Emoji$EmojiData, 'flag mx', 3, 22),
		A3($author$project$Emoji$EmojiData, 'flag my', 3, 23),
		A3($author$project$Emoji$EmojiData, 'flag mz', 3, 24),
		A3($author$project$Emoji$EmojiData, 'flag na', 3, 25),
		A3($author$project$Emoji$EmojiData, 'flag nc', 3, 26),
		A3($author$project$Emoji$EmojiData, 'flag ne', 3, 27),
		A3($author$project$Emoji$EmojiData, 'flag nf', 3, 28),
		A3($author$project$Emoji$EmojiData, 'flag ng', 3, 29),
		A3($author$project$Emoji$EmojiData, 'flag ni', 3, 30),
		A3($author$project$Emoji$EmojiData, 'flag nl', 3, 31),
		A3($author$project$Emoji$EmojiData, 'flag no', 3, 32),
		A3($author$project$Emoji$EmojiData, 'flag np', 3, 33),
		A3($author$project$Emoji$EmojiData, 'flag nr', 3, 34),
		A3($author$project$Emoji$EmojiData, 'flag nu', 3, 35),
		A3($author$project$Emoji$EmojiData, 'flag nz', 3, 36),
		A3($author$project$Emoji$EmojiData, 'flag om', 3, 37),
		A3($author$project$Emoji$EmojiData, 'flag pa', 3, 38),
		A3($author$project$Emoji$EmojiData, 'flag pe', 3, 39),
		A3($author$project$Emoji$EmojiData, 'flag pf', 3, 40),
		A3($author$project$Emoji$EmojiData, 'flag pg', 3, 41),
		A3($author$project$Emoji$EmojiData, 'flag ph', 3, 42),
		A3($author$project$Emoji$EmojiData, 'flag pk', 3, 43),
		A3($author$project$Emoji$EmojiData, 'flag pl', 3, 44),
		A3($author$project$Emoji$EmojiData, 'flag pm', 3, 45),
		A3($author$project$Emoji$EmojiData, 'flag pn', 3, 46),
		A3($author$project$Emoji$EmojiData, 'flag pr', 3, 47),
		A3($author$project$Emoji$EmojiData, 'flag ps', 3, 48),
		A3($author$project$Emoji$EmojiData, 'flag pt', 3, 49),
		A3($author$project$Emoji$EmojiData, 'flag pw', 3, 50),
		A3($author$project$Emoji$EmojiData, 'flag py', 3, 51),
		A3($author$project$Emoji$EmojiData, 'flag qa', 3, 52),
		A3($author$project$Emoji$EmojiData, 'flag re', 3, 53),
		A3($author$project$Emoji$EmojiData, 'flag ro', 3, 54),
		A3($author$project$Emoji$EmojiData, 'flag rs', 3, 55),
		A3($author$project$Emoji$EmojiData, 'ru', 3, 56),
		A3($author$project$Emoji$EmojiData, 'flag rw', 4, 0),
		A3($author$project$Emoji$EmojiData, 'flag sa', 4, 1),
		A3($author$project$Emoji$EmojiData, 'flag sb', 4, 2),
		A3($author$project$Emoji$EmojiData, 'flag sc', 4, 3),
		A3($author$project$Emoji$EmojiData, 'flag sd', 4, 4),
		A3($author$project$Emoji$EmojiData, 'flag se', 4, 5),
		A3($author$project$Emoji$EmojiData, 'flag sg', 4, 6),
		A3($author$project$Emoji$EmojiData, 'flag sh', 4, 7),
		A3($author$project$Emoji$EmojiData, 'flag si', 4, 8),
		A3($author$project$Emoji$EmojiData, 'flag sj', 4, 9),
		A3($author$project$Emoji$EmojiData, 'flag sk', 4, 10),
		A3($author$project$Emoji$EmojiData, 'flag sl', 4, 11),
		A3($author$project$Emoji$EmojiData, 'flag sm', 4, 12),
		A3($author$project$Emoji$EmojiData, 'flag sn', 4, 13),
		A3($author$project$Emoji$EmojiData, 'flag so', 4, 14),
		A3($author$project$Emoji$EmojiData, 'flag sr', 4, 15),
		A3($author$project$Emoji$EmojiData, 'flag ss', 4, 16),
		A3($author$project$Emoji$EmojiData, 'flag st', 4, 17),
		A3($author$project$Emoji$EmojiData, 'flag sv', 4, 18),
		A3($author$project$Emoji$EmojiData, 'flag sx', 4, 19),
		A3($author$project$Emoji$EmojiData, 'flag sy', 4, 20),
		A3($author$project$Emoji$EmojiData, 'flag sz', 4, 21),
		A3($author$project$Emoji$EmojiData, 'flag ta', 4, 22),
		A3($author$project$Emoji$EmojiData, 'flag tc', 4, 23),
		A3($author$project$Emoji$EmojiData, 'flag td', 4, 24),
		A3($author$project$Emoji$EmojiData, 'flag tf', 4, 25),
		A3($author$project$Emoji$EmojiData, 'flag tg', 4, 26),
		A3($author$project$Emoji$EmojiData, 'flag th', 4, 27),
		A3($author$project$Emoji$EmojiData, 'flag tj', 4, 28),
		A3($author$project$Emoji$EmojiData, 'flag tk', 4, 29),
		A3($author$project$Emoji$EmojiData, 'flag tl', 4, 30),
		A3($author$project$Emoji$EmojiData, 'flag tm', 4, 31),
		A3($author$project$Emoji$EmojiData, 'flag tn', 4, 32),
		A3($author$project$Emoji$EmojiData, 'flag to', 4, 33),
		A3($author$project$Emoji$EmojiData, 'flag tr', 4, 34),
		A3($author$project$Emoji$EmojiData, 'flag tt', 4, 35),
		A3($author$project$Emoji$EmojiData, 'flag tv', 4, 36),
		A3($author$project$Emoji$EmojiData, 'flag tw', 4, 37),
		A3($author$project$Emoji$EmojiData, 'flag tz', 4, 38),
		A3($author$project$Emoji$EmojiData, 'flag ua', 4, 39),
		A3($author$project$Emoji$EmojiData, 'flag ug', 4, 40),
		A3($author$project$Emoji$EmojiData, 'flag um', 4, 41),
		A3($author$project$Emoji$EmojiData, 'flag un', 4, 42),
		A3($author$project$Emoji$EmojiData, 'us', 4, 43),
		A3($author$project$Emoji$EmojiData, 'flag uy', 4, 44),
		A3($author$project$Emoji$EmojiData, 'flag uz', 4, 45),
		A3($author$project$Emoji$EmojiData, 'flag va', 4, 46),
		A3($author$project$Emoji$EmojiData, 'flag vc', 4, 47),
		A3($author$project$Emoji$EmojiData, 'flag ve', 4, 48),
		A3($author$project$Emoji$EmojiData, 'flag vg', 4, 49),
		A3($author$project$Emoji$EmojiData, 'flag vi', 4, 50),
		A3($author$project$Emoji$EmojiData, 'flag vn', 4, 51),
		A3($author$project$Emoji$EmojiData, 'flag vu', 4, 52),
		A3($author$project$Emoji$EmojiData, 'flag wf', 4, 53),
		A3($author$project$Emoji$EmojiData, 'flag ws', 4, 54),
		A3($author$project$Emoji$EmojiData, 'flag xk', 4, 55),
		A3($author$project$Emoji$EmojiData, 'flag ye', 4, 56),
		A3($author$project$Emoji$EmojiData, 'flag yt', 5, 0),
		A3($author$project$Emoji$EmojiData, 'flag za', 5, 1),
		A3($author$project$Emoji$EmojiData, 'flag zm', 5, 2),
		A3($author$project$Emoji$EmojiData, 'flag zw', 5, 3),
		A3($author$project$Emoji$EmojiData, 'koko', 5, 4),
		A3($author$project$Emoji$EmojiData, 'sa', 5, 5),
		A3($author$project$Emoji$EmojiData, 'u7121', 5, 6),
		A3($author$project$Emoji$EmojiData, 'u6307', 5, 7),
		A3($author$project$Emoji$EmojiData, 'u7981', 5, 8),
		A3($author$project$Emoji$EmojiData, 'u7a7a', 5, 9),
		A3($author$project$Emoji$EmojiData, 'u5408', 5, 10),
		A3($author$project$Emoji$EmojiData, 'u6e80', 5, 11),
		A3($author$project$Emoji$EmojiData, 'u6709', 5, 12),
		A3($author$project$Emoji$EmojiData, 'u6708', 5, 13),
		A3($author$project$Emoji$EmojiData, 'u7533', 5, 14),
		A3($author$project$Emoji$EmojiData, 'u5272', 5, 15),
		A3($author$project$Emoji$EmojiData, 'u55b6', 5, 16),
		A3($author$project$Emoji$EmojiData, 'ideograph advantage', 5, 17),
		A3($author$project$Emoji$EmojiData, 'accept', 5, 18),
		A3($author$project$Emoji$EmojiData, 'cyclone', 5, 19),
		A3($author$project$Emoji$EmojiData, 'foggy', 5, 20),
		A3($author$project$Emoji$EmojiData, 'closed umbrella', 5, 21),
		A3($author$project$Emoji$EmojiData, 'night with stars', 5, 22),
		A3($author$project$Emoji$EmojiData, 'sunrise over mountains', 5, 23),
		A3($author$project$Emoji$EmojiData, 'sunrise', 5, 24),
		A3($author$project$Emoji$EmojiData, 'city sunset', 5, 25),
		A3($author$project$Emoji$EmojiData, 'city sunrise', 5, 26),
		A3($author$project$Emoji$EmojiData, 'rainbow', 5, 27),
		A3($author$project$Emoji$EmojiData, 'bridge at night', 5, 28),
		A3($author$project$Emoji$EmojiData, 'ocean', 5, 29),
		A3($author$project$Emoji$EmojiData, 'volcano', 5, 30),
		A3($author$project$Emoji$EmojiData, 'milky way', 5, 31),
		A3($author$project$Emoji$EmojiData, 'earth africa', 5, 32),
		A3($author$project$Emoji$EmojiData, 'earth americas', 5, 33),
		A3($author$project$Emoji$EmojiData, 'earth asia', 5, 34),
		A3($author$project$Emoji$EmojiData, 'globe with meridians', 5, 35),
		A3($author$project$Emoji$EmojiData, 'new moon', 5, 36),
		A3($author$project$Emoji$EmojiData, 'waxing crescent moon', 5, 37),
		A3($author$project$Emoji$EmojiData, 'first quarter moon', 5, 38),
		A3($author$project$Emoji$EmojiData, 'moon', 5, 39),
		A3($author$project$Emoji$EmojiData, 'full moon', 5, 40),
		A3($author$project$Emoji$EmojiData, 'waning gibbous moon', 5, 41),
		A3($author$project$Emoji$EmojiData, 'last quarter moon', 5, 42),
		A3($author$project$Emoji$EmojiData, 'waning crescent moon', 5, 43),
		A3($author$project$Emoji$EmojiData, 'crescent moon', 5, 44),
		A3($author$project$Emoji$EmojiData, 'new moon with face', 5, 45),
		A3($author$project$Emoji$EmojiData, 'first quarter moon with face', 5, 46),
		A3($author$project$Emoji$EmojiData, 'last quarter moon with face', 5, 47),
		A3($author$project$Emoji$EmojiData, 'full moon with face', 5, 48),
		A3($author$project$Emoji$EmojiData, 'sun with face', 5, 49),
		A3($author$project$Emoji$EmojiData, 'star2', 5, 50),
		A3($author$project$Emoji$EmojiData, 'stars', 5, 51),
		A3($author$project$Emoji$EmojiData, 'thermometer', 5, 52),
		A3($author$project$Emoji$EmojiData, 'mostly sunny', 5, 53),
		A3($author$project$Emoji$EmojiData, 'barely sunny', 5, 54),
		A3($author$project$Emoji$EmojiData, 'partly sunny rain', 5, 55),
		A3($author$project$Emoji$EmojiData, 'rain cloud', 5, 56),
		A3($author$project$Emoji$EmojiData, 'snow cloud', 6, 0),
		A3($author$project$Emoji$EmojiData, 'lightning', 6, 1),
		A3($author$project$Emoji$EmojiData, 'tornado', 6, 2),
		A3($author$project$Emoji$EmojiData, 'fog', 6, 3),
		A3($author$project$Emoji$EmojiData, 'wind blowing face', 6, 4),
		A3($author$project$Emoji$EmojiData, 'hotdog', 6, 5),
		A3($author$project$Emoji$EmojiData, 'taco', 6, 6),
		A3($author$project$Emoji$EmojiData, 'burrito', 6, 7),
		A3($author$project$Emoji$EmojiData, 'chestnut', 6, 8),
		A3($author$project$Emoji$EmojiData, 'seedling', 6, 9),
		A3($author$project$Emoji$EmojiData, 'evergreen tree', 6, 10),
		A3($author$project$Emoji$EmojiData, 'deciduous tree', 6, 11),
		A3($author$project$Emoji$EmojiData, 'palm tree', 6, 12),
		A3($author$project$Emoji$EmojiData, 'cactus', 6, 13),
		A3($author$project$Emoji$EmojiData, 'hot pepper', 6, 14),
		A3($author$project$Emoji$EmojiData, 'tulip', 6, 15),
		A3($author$project$Emoji$EmojiData, 'cherry blossom', 6, 16),
		A3($author$project$Emoji$EmojiData, 'rose', 6, 17),
		A3($author$project$Emoji$EmojiData, 'hibiscus', 6, 18),
		A3($author$project$Emoji$EmojiData, 'sunflower', 6, 19),
		A3($author$project$Emoji$EmojiData, 'blossom', 6, 20),
		A3($author$project$Emoji$EmojiData, 'corn', 6, 21),
		A3($author$project$Emoji$EmojiData, 'ear of rice', 6, 22),
		A3($author$project$Emoji$EmojiData, 'herb', 6, 23),
		A3($author$project$Emoji$EmojiData, 'four leaf clover', 6, 24),
		A3($author$project$Emoji$EmojiData, 'maple leaf', 6, 25),
		A3($author$project$Emoji$EmojiData, 'fallen leaf', 6, 26),
		A3($author$project$Emoji$EmojiData, 'leaves', 6, 27),
		A3($author$project$Emoji$EmojiData, 'mushroom', 6, 28),
		A3($author$project$Emoji$EmojiData, 'tomato', 6, 29),
		A3($author$project$Emoji$EmojiData, 'eggplant', 6, 30),
		A3($author$project$Emoji$EmojiData, 'grapes', 6, 31),
		A3($author$project$Emoji$EmojiData, 'melon', 6, 32),
		A3($author$project$Emoji$EmojiData, 'watermelon', 6, 33),
		A3($author$project$Emoji$EmojiData, 'tangerine', 6, 34),
		A3($author$project$Emoji$EmojiData, 'lemon', 6, 35),
		A3($author$project$Emoji$EmojiData, 'banana', 6, 36),
		A3($author$project$Emoji$EmojiData, 'pineapple', 6, 37),
		A3($author$project$Emoji$EmojiData, 'apple', 6, 38),
		A3($author$project$Emoji$EmojiData, 'green apple', 6, 39),
		A3($author$project$Emoji$EmojiData, 'pear', 6, 40),
		A3($author$project$Emoji$EmojiData, 'peach', 6, 41),
		A3($author$project$Emoji$EmojiData, 'cherries', 6, 42),
		A3($author$project$Emoji$EmojiData, 'strawberry', 6, 43),
		A3($author$project$Emoji$EmojiData, 'hamburger', 6, 44),
		A3($author$project$Emoji$EmojiData, 'pizza', 6, 45),
		A3($author$project$Emoji$EmojiData, 'meat on bone', 6, 46),
		A3($author$project$Emoji$EmojiData, 'poultry leg', 6, 47),
		A3($author$project$Emoji$EmojiData, 'rice cracker', 6, 48),
		A3($author$project$Emoji$EmojiData, 'rice ball', 6, 49),
		A3($author$project$Emoji$EmojiData, 'rice', 6, 50),
		A3($author$project$Emoji$EmojiData, 'curry', 6, 51),
		A3($author$project$Emoji$EmojiData, 'ramen', 6, 52),
		A3($author$project$Emoji$EmojiData, 'spaghetti', 6, 53),
		A3($author$project$Emoji$EmojiData, 'bread', 6, 54),
		A3($author$project$Emoji$EmojiData, 'fries', 6, 55),
		A3($author$project$Emoji$EmojiData, 'sweet potato', 6, 56),
		A3($author$project$Emoji$EmojiData, 'dango', 7, 0),
		A3($author$project$Emoji$EmojiData, 'oden', 7, 1),
		A3($author$project$Emoji$EmojiData, 'sushi', 7, 2),
		A3($author$project$Emoji$EmojiData, 'fried shrimp', 7, 3),
		A3($author$project$Emoji$EmojiData, 'fish cake', 7, 4),
		A3($author$project$Emoji$EmojiData, 'icecream', 7, 5),
		A3($author$project$Emoji$EmojiData, 'shaved ice', 7, 6),
		A3($author$project$Emoji$EmojiData, 'ice cream', 7, 7),
		A3($author$project$Emoji$EmojiData, 'doughnut', 7, 8),
		A3($author$project$Emoji$EmojiData, 'cookie', 7, 9),
		A3($author$project$Emoji$EmojiData, 'chocolate bar', 7, 10),
		A3($author$project$Emoji$EmojiData, 'candy', 7, 11),
		A3($author$project$Emoji$EmojiData, 'lollipop', 7, 12),
		A3($author$project$Emoji$EmojiData, 'custard', 7, 13),
		A3($author$project$Emoji$EmojiData, 'honey pot', 7, 14),
		A3($author$project$Emoji$EmojiData, 'cake', 7, 15),
		A3($author$project$Emoji$EmojiData, 'bento', 7, 16),
		A3($author$project$Emoji$EmojiData, 'stew', 7, 17),
		A3($author$project$Emoji$EmojiData, 'fried egg', 7, 18),
		A3($author$project$Emoji$EmojiData, 'fork and knife', 7, 19),
		A3($author$project$Emoji$EmojiData, 'tea', 7, 20),
		A3($author$project$Emoji$EmojiData, 'sake', 7, 21),
		A3($author$project$Emoji$EmojiData, 'wine glass', 7, 22),
		A3($author$project$Emoji$EmojiData, 'cocktail', 7, 23),
		A3($author$project$Emoji$EmojiData, 'tropical drink', 7, 24),
		A3($author$project$Emoji$EmojiData, 'beer', 7, 25),
		A3($author$project$Emoji$EmojiData, 'beers', 7, 26),
		A3($author$project$Emoji$EmojiData, 'baby bottle', 7, 27),
		A3($author$project$Emoji$EmojiData, 'knife fork plate', 7, 28),
		A3($author$project$Emoji$EmojiData, 'champagne', 7, 29),
		A3($author$project$Emoji$EmojiData, 'popcorn', 7, 30),
		A3($author$project$Emoji$EmojiData, 'ribbon', 7, 31),
		A3($author$project$Emoji$EmojiData, 'gift', 7, 32),
		A3($author$project$Emoji$EmojiData, 'birthday', 7, 33),
		A3($author$project$Emoji$EmojiData, 'jack o lantern', 7, 34),
		A3($author$project$Emoji$EmojiData, 'christmas tree', 7, 35),
		A3($author$project$Emoji$EmojiData, 'santa', 7, 36),
		A3($author$project$Emoji$EmojiData, 'fireworks', 7, 42),
		A3($author$project$Emoji$EmojiData, 'sparkler', 7, 43),
		A3($author$project$Emoji$EmojiData, 'balloon', 7, 44),
		A3($author$project$Emoji$EmojiData, 'tada', 7, 45),
		A3($author$project$Emoji$EmojiData, 'confetti ball', 7, 46),
		A3($author$project$Emoji$EmojiData, 'tanabata tree', 7, 47),
		A3($author$project$Emoji$EmojiData, 'crossed flags', 7, 48),
		A3($author$project$Emoji$EmojiData, 'bamboo', 7, 49),
		A3($author$project$Emoji$EmojiData, 'dolls', 7, 50),
		A3($author$project$Emoji$EmojiData, 'flags', 7, 51),
		A3($author$project$Emoji$EmojiData, 'wind chime', 7, 52),
		A3($author$project$Emoji$EmojiData, 'rice scene', 7, 53),
		A3($author$project$Emoji$EmojiData, 'school satchel', 7, 54),
		A3($author$project$Emoji$EmojiData, 'mortar board', 7, 55),
		A3($author$project$Emoji$EmojiData, 'medal', 7, 56),
		A3($author$project$Emoji$EmojiData, 'reminder ribbon', 8, 0),
		A3($author$project$Emoji$EmojiData, 'studio microphone', 8, 1),
		A3($author$project$Emoji$EmojiData, 'level slider', 8, 2),
		A3($author$project$Emoji$EmojiData, 'control knobs', 8, 3),
		A3($author$project$Emoji$EmojiData, 'film frames', 8, 4),
		A3($author$project$Emoji$EmojiData, 'admission tickets', 8, 5),
		A3($author$project$Emoji$EmojiData, 'carousel horse', 8, 6),
		A3($author$project$Emoji$EmojiData, 'ferris wheel', 8, 7),
		A3($author$project$Emoji$EmojiData, 'roller coaster', 8, 8),
		A3($author$project$Emoji$EmojiData, 'fishing pole and fish', 8, 9),
		A3($author$project$Emoji$EmojiData, 'microphone', 8, 10),
		A3($author$project$Emoji$EmojiData, 'movie camera', 8, 11),
		A3($author$project$Emoji$EmojiData, 'cinema', 8, 12),
		A3($author$project$Emoji$EmojiData, 'headphones', 8, 13),
		A3($author$project$Emoji$EmojiData, 'art', 8, 14),
		A3($author$project$Emoji$EmojiData, 'tophat', 8, 15),
		A3($author$project$Emoji$EmojiData, 'circus tent', 8, 16),
		A3($author$project$Emoji$EmojiData, 'ticket', 8, 17),
		A3($author$project$Emoji$EmojiData, 'clapper', 8, 18),
		A3($author$project$Emoji$EmojiData, 'performing arts', 8, 19),
		A3($author$project$Emoji$EmojiData, 'video game', 8, 20),
		A3($author$project$Emoji$EmojiData, 'dart', 8, 21),
		A3($author$project$Emoji$EmojiData, 'slot machine', 8, 22),
		A3($author$project$Emoji$EmojiData, '8ball', 8, 23),
		A3($author$project$Emoji$EmojiData, 'game die', 8, 24),
		A3($author$project$Emoji$EmojiData, 'bowling', 8, 25),
		A3($author$project$Emoji$EmojiData, 'flower playing cards', 8, 26),
		A3($author$project$Emoji$EmojiData, 'musical note', 8, 27),
		A3($author$project$Emoji$EmojiData, 'notes', 8, 28),
		A3($author$project$Emoji$EmojiData, 'saxophone', 8, 29),
		A3($author$project$Emoji$EmojiData, 'guitar', 8, 30),
		A3($author$project$Emoji$EmojiData, 'musical keyboard', 8, 31),
		A3($author$project$Emoji$EmojiData, 'trumpet', 8, 32),
		A3($author$project$Emoji$EmojiData, 'violin', 8, 33),
		A3($author$project$Emoji$EmojiData, 'musical score', 8, 34),
		A3($author$project$Emoji$EmojiData, 'running shirt with sash', 8, 35),
		A3($author$project$Emoji$EmojiData, 'tennis', 8, 36),
		A3($author$project$Emoji$EmojiData, 'ski', 8, 37),
		A3($author$project$Emoji$EmojiData, 'basketball', 8, 38),
		A3($author$project$Emoji$EmojiData, 'checkered flag', 8, 39),
		A3($author$project$Emoji$EmojiData, 'snowboarder', 8, 40),
		A3($author$project$Emoji$EmojiData, 'woman running', 8, 46),
		A3($author$project$Emoji$EmojiData, 'man running', 8, 52),
		A3($author$project$Emoji$EmojiData, 'runner', 9, 1),
		A3($author$project$Emoji$EmojiData, 'woman surfing', 9, 7),
		A3($author$project$Emoji$EmojiData, 'man surfing', 9, 13),
		A3($author$project$Emoji$EmojiData, 'surfer', 9, 19),
		A3($author$project$Emoji$EmojiData, 'sports medal', 9, 25),
		A3($author$project$Emoji$EmojiData, 'trophy', 9, 26),
		A3($author$project$Emoji$EmojiData, 'horse racing', 9, 27),
		A3($author$project$Emoji$EmojiData, 'football', 9, 33),
		A3($author$project$Emoji$EmojiData, 'rugby football', 9, 34),
		A3($author$project$Emoji$EmojiData, 'woman swimming', 9, 35),
		A3($author$project$Emoji$EmojiData, 'man swimming', 9, 41),
		A3($author$project$Emoji$EmojiData, 'swimmer', 9, 47),
		A3($author$project$Emoji$EmojiData, 'woman lifting weights', 9, 53),
		A3($author$project$Emoji$EmojiData, 'man lifting weights', 10, 2),
		A3($author$project$Emoji$EmojiData, 'weight lifter', 10, 8),
		A3($author$project$Emoji$EmojiData, 'woman golfing', 10, 14),
		A3($author$project$Emoji$EmojiData, 'man golfing', 10, 20),
		A3($author$project$Emoji$EmojiData, 'golfer', 10, 26),
		A3($author$project$Emoji$EmojiData, 'racing motorcycle', 10, 32),
		A3($author$project$Emoji$EmojiData, 'racing car', 10, 33),
		A3($author$project$Emoji$EmojiData, 'cricket bat and ball', 10, 34),
		A3($author$project$Emoji$EmojiData, 'volleyball', 10, 35),
		A3($author$project$Emoji$EmojiData, 'field hockey stick and ball', 10, 36),
		A3($author$project$Emoji$EmojiData, 'ice hockey stick and puck', 10, 37),
		A3($author$project$Emoji$EmojiData, 'table tennis paddle and ball', 10, 38),
		A3($author$project$Emoji$EmojiData, 'snow capped mountain', 10, 39),
		A3($author$project$Emoji$EmojiData, 'camping', 10, 40),
		A3($author$project$Emoji$EmojiData, 'beach with umbrella', 10, 41),
		A3($author$project$Emoji$EmojiData, 'building construction', 10, 42),
		A3($author$project$Emoji$EmojiData, 'house buildings', 10, 43),
		A3($author$project$Emoji$EmojiData, 'cityscape', 10, 44),
		A3($author$project$Emoji$EmojiData, 'derelict house building', 10, 45),
		A3($author$project$Emoji$EmojiData, 'classical building', 10, 46),
		A3($author$project$Emoji$EmojiData, 'desert', 10, 47),
		A3($author$project$Emoji$EmojiData, 'desert island', 10, 48),
		A3($author$project$Emoji$EmojiData, 'national park', 10, 49),
		A3($author$project$Emoji$EmojiData, 'stadium', 10, 50),
		A3($author$project$Emoji$EmojiData, 'house', 10, 51),
		A3($author$project$Emoji$EmojiData, 'house with garden', 10, 52),
		A3($author$project$Emoji$EmojiData, 'office', 10, 53),
		A3($author$project$Emoji$EmojiData, 'post office', 10, 54),
		A3($author$project$Emoji$EmojiData, 'european post office', 10, 55),
		A3($author$project$Emoji$EmojiData, 'hospital', 10, 56),
		A3($author$project$Emoji$EmojiData, 'bank', 11, 0),
		A3($author$project$Emoji$EmojiData, 'atm', 11, 1),
		A3($author$project$Emoji$EmojiData, 'hotel', 11, 2),
		A3($author$project$Emoji$EmojiData, 'love hotel', 11, 3),
		A3($author$project$Emoji$EmojiData, 'convenience store', 11, 4),
		A3($author$project$Emoji$EmojiData, 'school', 11, 5),
		A3($author$project$Emoji$EmojiData, 'department store', 11, 6),
		A3($author$project$Emoji$EmojiData, 'factory', 11, 7),
		A3($author$project$Emoji$EmojiData, 'izakaya lantern', 11, 8),
		A3($author$project$Emoji$EmojiData, 'japanese castle', 11, 9),
		A3($author$project$Emoji$EmojiData, 'european castle', 11, 10),
		A3($author$project$Emoji$EmojiData, 'rainbow flag', 11, 11),
		A3($author$project$Emoji$EmojiData, 'waving white flag', 11, 12),
		A3($author$project$Emoji$EmojiData, 'pirate flag', 11, 13),
		A3($author$project$Emoji$EmojiData, 'flag england', 11, 14),
		A3($author$project$Emoji$EmojiData, 'flag scotland', 11, 15),
		A3($author$project$Emoji$EmojiData, 'flag wales', 11, 16),
		A3($author$project$Emoji$EmojiData, 'waving black flag', 11, 17),
		A3($author$project$Emoji$EmojiData, 'rosette', 11, 18),
		A3($author$project$Emoji$EmojiData, 'label', 11, 19),
		A3($author$project$Emoji$EmojiData, 'badminton racquet and shuttlecock', 11, 20),
		A3($author$project$Emoji$EmojiData, 'bow and arrow', 11, 21),
		A3($author$project$Emoji$EmojiData, 'amphora', 11, 22),
		A3($author$project$Emoji$EmojiData, 'skin tone 2', 11, 23),
		A3($author$project$Emoji$EmojiData, 'skin tone 3', 11, 24),
		A3($author$project$Emoji$EmojiData, 'skin tone 4', 11, 25),
		A3($author$project$Emoji$EmojiData, 'skin tone 5', 11, 26),
		A3($author$project$Emoji$EmojiData, 'skin tone 6', 11, 27),
		A3($author$project$Emoji$EmojiData, 'rat', 11, 28),
		A3($author$project$Emoji$EmojiData, 'mouse2', 11, 29),
		A3($author$project$Emoji$EmojiData, 'ox', 11, 30),
		A3($author$project$Emoji$EmojiData, 'water buffalo', 11, 31),
		A3($author$project$Emoji$EmojiData, 'cow2', 11, 32),
		A3($author$project$Emoji$EmojiData, 'tiger2', 11, 33),
		A3($author$project$Emoji$EmojiData, 'leopard', 11, 34),
		A3($author$project$Emoji$EmojiData, 'rabbit2', 11, 35),
		A3($author$project$Emoji$EmojiData, 'cat2', 11, 36),
		A3($author$project$Emoji$EmojiData, 'dragon', 11, 37),
		A3($author$project$Emoji$EmojiData, 'crocodile', 11, 38),
		A3($author$project$Emoji$EmojiData, 'whale2', 11, 39),
		A3($author$project$Emoji$EmojiData, 'snail', 11, 40),
		A3($author$project$Emoji$EmojiData, 'snake', 11, 41),
		A3($author$project$Emoji$EmojiData, 'racehorse', 11, 42),
		A3($author$project$Emoji$EmojiData, 'ram', 11, 43),
		A3($author$project$Emoji$EmojiData, 'goat', 11, 44),
		A3($author$project$Emoji$EmojiData, 'sheep', 11, 45),
		A3($author$project$Emoji$EmojiData, 'monkey', 11, 46),
		A3($author$project$Emoji$EmojiData, 'rooster', 11, 47),
		A3($author$project$Emoji$EmojiData, 'chicken', 11, 48),
		A3($author$project$Emoji$EmojiData, 'service dog', 11, 49),
		A3($author$project$Emoji$EmojiData, 'dog2', 11, 50),
		A3($author$project$Emoji$EmojiData, 'pig2', 11, 51),
		A3($author$project$Emoji$EmojiData, 'boar', 11, 52),
		A3($author$project$Emoji$EmojiData, 'elephant', 11, 53),
		A3($author$project$Emoji$EmojiData, 'octopus', 11, 54),
		A3($author$project$Emoji$EmojiData, 'shell', 11, 55),
		A3($author$project$Emoji$EmojiData, 'bug', 11, 56),
		A3($author$project$Emoji$EmojiData, 'ant', 12, 0),
		A3($author$project$Emoji$EmojiData, 'bee', 12, 1),
		A3($author$project$Emoji$EmojiData, 'beetle', 12, 2),
		A3($author$project$Emoji$EmojiData, 'fish', 12, 3),
		A3($author$project$Emoji$EmojiData, 'tropical fish', 12, 4),
		A3($author$project$Emoji$EmojiData, 'blowfish', 12, 5),
		A3($author$project$Emoji$EmojiData, 'turtle', 12, 6),
		A3($author$project$Emoji$EmojiData, 'hatching chick', 12, 7),
		A3($author$project$Emoji$EmojiData, 'baby chick', 12, 8),
		A3($author$project$Emoji$EmojiData, 'hatched chick', 12, 9),
		A3($author$project$Emoji$EmojiData, 'bird', 12, 10),
		A3($author$project$Emoji$EmojiData, 'penguin', 12, 11),
		A3($author$project$Emoji$EmojiData, 'koala', 12, 12),
		A3($author$project$Emoji$EmojiData, 'poodle', 12, 13),
		A3($author$project$Emoji$EmojiData, 'dromedary camel', 12, 14),
		A3($author$project$Emoji$EmojiData, 'camel', 12, 15),
		A3($author$project$Emoji$EmojiData, 'dolphin', 12, 16),
		A3($author$project$Emoji$EmojiData, 'mouse', 12, 17),
		A3($author$project$Emoji$EmojiData, 'cow', 12, 18),
		A3($author$project$Emoji$EmojiData, 'tiger', 12, 19),
		A3($author$project$Emoji$EmojiData, 'rabbit', 12, 20),
		A3($author$project$Emoji$EmojiData, 'cat', 12, 21),
		A3($author$project$Emoji$EmojiData, 'dragon face', 12, 22),
		A3($author$project$Emoji$EmojiData, 'whale', 12, 23),
		A3($author$project$Emoji$EmojiData, 'horse', 12, 24),
		A3($author$project$Emoji$EmojiData, 'monkey face', 12, 25),
		A3($author$project$Emoji$EmojiData, 'dog', 12, 26),
		A3($author$project$Emoji$EmojiData, 'pig', 12, 27),
		A3($author$project$Emoji$EmojiData, 'frog', 12, 28),
		A3($author$project$Emoji$EmojiData, 'hamster', 12, 29),
		A3($author$project$Emoji$EmojiData, 'wolf', 12, 30),
		A3($author$project$Emoji$EmojiData, 'bear', 12, 31),
		A3($author$project$Emoji$EmojiData, 'panda face', 12, 32),
		A3($author$project$Emoji$EmojiData, 'pig nose', 12, 33),
		A3($author$project$Emoji$EmojiData, 'feet', 12, 34),
		A3($author$project$Emoji$EmojiData, 'chipmunk', 12, 35),
		A3($author$project$Emoji$EmojiData, 'eyes', 12, 36),
		A3($author$project$Emoji$EmojiData, 'eye in speech bubble', 12, 37),
		A3($author$project$Emoji$EmojiData, 'eye', 12, 38),
		A3($author$project$Emoji$EmojiData, 'ear', 12, 39),
		A3($author$project$Emoji$EmojiData, 'nose', 12, 45),
		A3($author$project$Emoji$EmojiData, 'lips', 12, 51),
		A3($author$project$Emoji$EmojiData, 'tongue', 12, 52),
		A3($author$project$Emoji$EmojiData, 'point up 2', 12, 53),
		A3($author$project$Emoji$EmojiData, 'point down', 13, 2),
		A3($author$project$Emoji$EmojiData, 'point left', 13, 8),
		A3($author$project$Emoji$EmojiData, 'point right', 13, 14),
		A3($author$project$Emoji$EmojiData, 'facepunch', 13, 20),
		A3($author$project$Emoji$EmojiData, 'wave', 13, 26),
		A3($author$project$Emoji$EmojiData, 'ok hand', 13, 32),
		A3($author$project$Emoji$EmojiData, '+1', 13, 38),
		A3($author$project$Emoji$EmojiData, ' 1', 13, 44),
		A3($author$project$Emoji$EmojiData, 'clap', 13, 50),
		A3($author$project$Emoji$EmojiData, 'open hands', 13, 56),
		A3($author$project$Emoji$EmojiData, 'crown', 14, 5),
		A3($author$project$Emoji$EmojiData, 'womans hat', 14, 6),
		A3($author$project$Emoji$EmojiData, 'eyeglasses', 14, 7),
		A3($author$project$Emoji$EmojiData, 'necktie', 14, 8),
		A3($author$project$Emoji$EmojiData, 'shirt', 14, 9),
		A3($author$project$Emoji$EmojiData, 'jeans', 14, 10),
		A3($author$project$Emoji$EmojiData, 'dress', 14, 11),
		A3($author$project$Emoji$EmojiData, 'kimono', 14, 12),
		A3($author$project$Emoji$EmojiData, 'bikini', 14, 13),
		A3($author$project$Emoji$EmojiData, 'womans clothes', 14, 14),
		A3($author$project$Emoji$EmojiData, 'purse', 14, 15),
		A3($author$project$Emoji$EmojiData, 'handbag', 14, 16),
		A3($author$project$Emoji$EmojiData, 'pouch', 14, 17),
		A3($author$project$Emoji$EmojiData, 'mans shoe', 14, 18),
		A3($author$project$Emoji$EmojiData, 'athletic shoe', 14, 19),
		A3($author$project$Emoji$EmojiData, 'high heel', 14, 20),
		A3($author$project$Emoji$EmojiData, 'sandal', 14, 21),
		A3($author$project$Emoji$EmojiData, 'boot', 14, 22),
		A3($author$project$Emoji$EmojiData, 'footprints', 14, 23),
		A3($author$project$Emoji$EmojiData, 'bust in silhouette', 14, 24),
		A3($author$project$Emoji$EmojiData, 'busts in silhouette', 14, 25),
		A3($author$project$Emoji$EmojiData, 'boy', 14, 26),
		A3($author$project$Emoji$EmojiData, 'girl', 14, 32),
		A3($author$project$Emoji$EmojiData, 'male farmer', 14, 38),
		A3($author$project$Emoji$EmojiData, 'male cook', 14, 44),
		A3($author$project$Emoji$EmojiData, 'male student', 14, 50),
		A3($author$project$Emoji$EmojiData, 'male singer', 14, 56),
		A3($author$project$Emoji$EmojiData, 'male artist', 15, 5),
		A3($author$project$Emoji$EmojiData, 'male teacher', 15, 11),
		A3($author$project$Emoji$EmojiData, 'male factory worker', 15, 17),
		A3($author$project$Emoji$EmojiData, 'man boy boy', 15, 23),
		A3($author$project$Emoji$EmojiData, 'man boy', 15, 24),
		A3($author$project$Emoji$EmojiData, 'man girl boy', 15, 25),
		A3($author$project$Emoji$EmojiData, 'man girl girl', 15, 26),
		A3($author$project$Emoji$EmojiData, 'man girl', 15, 27),
		A3($author$project$Emoji$EmojiData, 'man man boy', 15, 28),
		A3($author$project$Emoji$EmojiData, 'man man boy boy', 15, 29),
		A3($author$project$Emoji$EmojiData, 'man man girl', 15, 30),
		A3($author$project$Emoji$EmojiData, 'man man girl boy', 15, 31),
		A3($author$project$Emoji$EmojiData, 'man man girl girl', 15, 32),
		A3($author$project$Emoji$EmojiData, 'man woman boy', 15, 33),
		A3($author$project$Emoji$EmojiData, 'man woman boy boy', 15, 34),
		A3($author$project$Emoji$EmojiData, 'man woman girl', 15, 35),
		A3($author$project$Emoji$EmojiData, 'man woman girl boy', 15, 36),
		A3($author$project$Emoji$EmojiData, 'man woman girl girl', 15, 37),
		A3($author$project$Emoji$EmojiData, 'male technologist', 15, 38),
		A3($author$project$Emoji$EmojiData, 'male office worker', 15, 44),
		A3($author$project$Emoji$EmojiData, 'male mechanic', 15, 50),
		A3($author$project$Emoji$EmojiData, 'male scientist', 15, 56),
		A3($author$project$Emoji$EmojiData, 'male astronaut', 16, 5),
		A3($author$project$Emoji$EmojiData, 'male firefighter', 16, 11),
		A3($author$project$Emoji$EmojiData, 'man with probing cane', 16, 17),
		A3($author$project$Emoji$EmojiData, 'red haired man', 16, 23),
		A3($author$project$Emoji$EmojiData, 'curly haired man', 16, 29),
		A3($author$project$Emoji$EmojiData, 'bald man', 16, 35),
		A3($author$project$Emoji$EmojiData, 'white haired man', 16, 41),
		A3($author$project$Emoji$EmojiData, 'man in motorized wheelchair', 16, 47),
		A3($author$project$Emoji$EmojiData, 'man in manual wheelchair', 16, 53),
		A3($author$project$Emoji$EmojiData, 'male doctor', 17, 2),
		A3($author$project$Emoji$EmojiData, 'male judge', 17, 8),
		A3($author$project$Emoji$EmojiData, 'male pilot', 17, 14),
		A3($author$project$Emoji$EmojiData, 'man heart man', 17, 20),
		A3($author$project$Emoji$EmojiData, 'man kiss man', 17, 21),
		A3($author$project$Emoji$EmojiData, 'man', 17, 22),
		A3($author$project$Emoji$EmojiData, 'female farmer', 17, 28),
		A3($author$project$Emoji$EmojiData, 'female cook', 17, 34),
		A3($author$project$Emoji$EmojiData, 'female student', 17, 40),
		A3($author$project$Emoji$EmojiData, 'female singer', 17, 46),
		A3($author$project$Emoji$EmojiData, 'female artist', 17, 52),
		A3($author$project$Emoji$EmojiData, 'female teacher', 18, 1),
		A3($author$project$Emoji$EmojiData, 'female factory worker', 18, 7),
		A3($author$project$Emoji$EmojiData, 'woman boy boy', 18, 13),
		A3($author$project$Emoji$EmojiData, 'woman boy', 18, 14),
		A3($author$project$Emoji$EmojiData, 'woman girl boy', 18, 15),
		A3($author$project$Emoji$EmojiData, 'woman girl girl', 18, 16),
		A3($author$project$Emoji$EmojiData, 'woman girl', 18, 17),
		A3($author$project$Emoji$EmojiData, 'woman woman boy', 18, 18),
		A3($author$project$Emoji$EmojiData, 'woman woman boy boy', 18, 19),
		A3($author$project$Emoji$EmojiData, 'woman woman girl', 18, 20),
		A3($author$project$Emoji$EmojiData, 'woman woman girl boy', 18, 21),
		A3($author$project$Emoji$EmojiData, 'woman woman girl girl', 18, 22),
		A3($author$project$Emoji$EmojiData, 'female technologist', 18, 23),
		A3($author$project$Emoji$EmojiData, 'female office worker', 18, 29),
		A3($author$project$Emoji$EmojiData, 'female mechanic', 18, 35),
		A3($author$project$Emoji$EmojiData, 'female scientist', 18, 41),
		A3($author$project$Emoji$EmojiData, 'female astronaut', 18, 47),
		A3($author$project$Emoji$EmojiData, 'female firefighter', 18, 53),
		A3($author$project$Emoji$EmojiData, 'woman with probing cane', 19, 2),
		A3($author$project$Emoji$EmojiData, 'red haired woman', 19, 8),
		A3($author$project$Emoji$EmojiData, 'curly haired woman', 19, 14),
		A3($author$project$Emoji$EmojiData, 'bald woman', 19, 20),
		A3($author$project$Emoji$EmojiData, 'white haired woman', 19, 26),
		A3($author$project$Emoji$EmojiData, 'woman in motorized wheelchair', 19, 32),
		A3($author$project$Emoji$EmojiData, 'woman in manual wheelchair', 19, 38),
		A3($author$project$Emoji$EmojiData, 'female doctor', 19, 44),
		A3($author$project$Emoji$EmojiData, 'female judge', 19, 50),
		A3($author$project$Emoji$EmojiData, 'female pilot', 19, 56),
		A3($author$project$Emoji$EmojiData, 'woman heart man', 20, 5),
		A3($author$project$Emoji$EmojiData, 'woman heart woman', 20, 6),
		A3($author$project$Emoji$EmojiData, 'woman kiss man', 20, 7),
		A3($author$project$Emoji$EmojiData, 'woman kiss woman', 20, 8),
		A3($author$project$Emoji$EmojiData, 'woman', 20, 9),
		A3($author$project$Emoji$EmojiData, 'family', 20, 15),
		A3($author$project$Emoji$EmojiData, 'couple', 20, 16),
		A3($author$project$Emoji$EmojiData, 'two men holding hands', 20, 42),
		A3($author$project$Emoji$EmojiData, 'two women holding hands', 21, 11),
		A3($author$project$Emoji$EmojiData, 'female police officer', 21, 37),
		A3($author$project$Emoji$EmojiData, 'male police officer', 21, 43),
		A3($author$project$Emoji$EmojiData, 'cop', 21, 49),
		A3($author$project$Emoji$EmojiData, 'woman with bunny ears partying', 21, 55),
		A3($author$project$Emoji$EmojiData, 'man with bunny ears partying', 21, 56),
		A3($author$project$Emoji$EmojiData, 'dancers', 22, 0),
		A3($author$project$Emoji$EmojiData, 'bride with veil', 22, 1),
		A3($author$project$Emoji$EmojiData, 'blond haired woman', 22, 7),
		A3($author$project$Emoji$EmojiData, 'blond haired man', 22, 13),
		A3($author$project$Emoji$EmojiData, 'person with blond hair', 22, 19),
		A3($author$project$Emoji$EmojiData, 'man with gua pi mao', 22, 25),
		A3($author$project$Emoji$EmojiData, 'woman wearing turban', 22, 31),
		A3($author$project$Emoji$EmojiData, 'man wearing turban', 22, 37),
		A3($author$project$Emoji$EmojiData, 'man with turban', 22, 43),
		A3($author$project$Emoji$EmojiData, 'older man', 22, 49),
		A3($author$project$Emoji$EmojiData, 'older woman', 22, 55),
		A3($author$project$Emoji$EmojiData, 'baby', 23, 4),
		A3($author$project$Emoji$EmojiData, 'female construction worker', 23, 10),
		A3($author$project$Emoji$EmojiData, 'male construction worker', 23, 16),
		A3($author$project$Emoji$EmojiData, 'construction worker', 23, 22),
		A3($author$project$Emoji$EmojiData, 'princess', 23, 28),
		A3($author$project$Emoji$EmojiData, 'japanese ogre', 23, 34),
		A3($author$project$Emoji$EmojiData, 'japanese goblin', 23, 35),
		A3($author$project$Emoji$EmojiData, 'ghost', 23, 36),
		A3($author$project$Emoji$EmojiData, 'angel', 23, 37),
		A3($author$project$Emoji$EmojiData, 'alien', 23, 43),
		A3($author$project$Emoji$EmojiData, 'space invader', 23, 44),
		A3($author$project$Emoji$EmojiData, 'imp', 23, 45),
		A3($author$project$Emoji$EmojiData, 'skull', 23, 46),
		A3($author$project$Emoji$EmojiData, 'woman tipping hand', 23, 47),
		A3($author$project$Emoji$EmojiData, 'man tipping hand', 23, 53),
		A3($author$project$Emoji$EmojiData, 'information desk person', 24, 2),
		A3($author$project$Emoji$EmojiData, 'female guard', 24, 8),
		A3($author$project$Emoji$EmojiData, 'male guard', 24, 14),
		A3($author$project$Emoji$EmojiData, 'guardsman', 24, 20),
		A3($author$project$Emoji$EmojiData, 'dancer', 24, 26),
		A3($author$project$Emoji$EmojiData, 'lipstick', 24, 32),
		A3($author$project$Emoji$EmojiData, 'nail care', 24, 33),
		A3($author$project$Emoji$EmojiData, 'woman getting massage', 24, 39),
		A3($author$project$Emoji$EmojiData, 'man getting massage', 24, 45),
		A3($author$project$Emoji$EmojiData, 'massage', 24, 51),
		A3($author$project$Emoji$EmojiData, 'woman getting haircut', 25, 0),
		A3($author$project$Emoji$EmojiData, 'man getting haircut', 25, 6),
		A3($author$project$Emoji$EmojiData, 'haircut', 25, 12),
		A3($author$project$Emoji$EmojiData, 'barber', 25, 18),
		A3($author$project$Emoji$EmojiData, 'syringe', 25, 19),
		A3($author$project$Emoji$EmojiData, 'pill', 25, 20),
		A3($author$project$Emoji$EmojiData, 'kiss', 25, 21),
		A3($author$project$Emoji$EmojiData, 'love letter', 25, 22),
		A3($author$project$Emoji$EmojiData, 'ring', 25, 23),
		A3($author$project$Emoji$EmojiData, 'gem', 25, 24),
		A3($author$project$Emoji$EmojiData, 'couplekiss', 25, 25),
		A3($author$project$Emoji$EmojiData, 'bouquet', 25, 26),
		A3($author$project$Emoji$EmojiData, 'couple with heart', 25, 27),
		A3($author$project$Emoji$EmojiData, 'wedding', 25, 28),
		A3($author$project$Emoji$EmojiData, 'heartbeat', 25, 29),
		A3($author$project$Emoji$EmojiData, 'broken heart', 25, 30),
		A3($author$project$Emoji$EmojiData, 'two hearts', 25, 31),
		A3($author$project$Emoji$EmojiData, 'sparkling heart', 25, 32),
		A3($author$project$Emoji$EmojiData, 'heartpulse', 25, 33),
		A3($author$project$Emoji$EmojiData, 'cupid', 25, 34),
		A3($author$project$Emoji$EmojiData, 'blue heart', 25, 35),
		A3($author$project$Emoji$EmojiData, 'green heart', 25, 36),
		A3($author$project$Emoji$EmojiData, 'yellow heart', 25, 37),
		A3($author$project$Emoji$EmojiData, 'purple heart', 25, 38),
		A3($author$project$Emoji$EmojiData, 'gift heart', 25, 39),
		A3($author$project$Emoji$EmojiData, 'revolving hearts', 25, 40),
		A3($author$project$Emoji$EmojiData, 'heart decoration', 25, 41),
		A3($author$project$Emoji$EmojiData, 'diamond shape with a dot inside', 25, 42),
		A3($author$project$Emoji$EmojiData, 'bulb', 25, 43),
		A3($author$project$Emoji$EmojiData, 'anger', 25, 44),
		A3($author$project$Emoji$EmojiData, 'bomb', 25, 45),
		A3($author$project$Emoji$EmojiData, 'zzz', 25, 46),
		A3($author$project$Emoji$EmojiData, 'boom', 25, 47),
		A3($author$project$Emoji$EmojiData, 'sweat drops', 25, 48),
		A3($author$project$Emoji$EmojiData, 'droplet', 25, 49),
		A3($author$project$Emoji$EmojiData, 'dash', 25, 50),
		A3($author$project$Emoji$EmojiData, 'hankey', 25, 51),
		A3($author$project$Emoji$EmojiData, 'muscle', 25, 52),
		A3($author$project$Emoji$EmojiData, 'dizzy', 26, 1),
		A3($author$project$Emoji$EmojiData, 'speech balloon', 26, 2),
		A3($author$project$Emoji$EmojiData, 'thought balloon', 26, 3),
		A3($author$project$Emoji$EmojiData, 'white flower', 26, 4),
		A3($author$project$Emoji$EmojiData, '100', 26, 5),
		A3($author$project$Emoji$EmojiData, 'moneybag', 26, 6),
		A3($author$project$Emoji$EmojiData, 'currency exchange', 26, 7),
		A3($author$project$Emoji$EmojiData, 'heavy dollar sign', 26, 8),
		A3($author$project$Emoji$EmojiData, 'credit card', 26, 9),
		A3($author$project$Emoji$EmojiData, 'yen', 26, 10),
		A3($author$project$Emoji$EmojiData, 'dollar', 26, 11),
		A3($author$project$Emoji$EmojiData, 'euro', 26, 12),
		A3($author$project$Emoji$EmojiData, 'pound', 26, 13),
		A3($author$project$Emoji$EmojiData, 'money with wings', 26, 14),
		A3($author$project$Emoji$EmojiData, 'chart', 26, 15),
		A3($author$project$Emoji$EmojiData, 'seat', 26, 16),
		A3($author$project$Emoji$EmojiData, 'computer', 26, 17),
		A3($author$project$Emoji$EmojiData, 'briefcase', 26, 18),
		A3($author$project$Emoji$EmojiData, 'minidisc', 26, 19),
		A3($author$project$Emoji$EmojiData, 'floppy disk', 26, 20),
		A3($author$project$Emoji$EmojiData, 'cd', 26, 21),
		A3($author$project$Emoji$EmojiData, 'dvd', 26, 22),
		A3($author$project$Emoji$EmojiData, 'file folder', 26, 23),
		A3($author$project$Emoji$EmojiData, 'open file folder', 26, 24),
		A3($author$project$Emoji$EmojiData, 'page with curl', 26, 25),
		A3($author$project$Emoji$EmojiData, 'page facing up', 26, 26),
		A3($author$project$Emoji$EmojiData, 'date', 26, 27),
		A3($author$project$Emoji$EmojiData, 'calendar', 26, 28),
		A3($author$project$Emoji$EmojiData, 'card index', 26, 29),
		A3($author$project$Emoji$EmojiData, 'chart with upwards trend', 26, 30),
		A3($author$project$Emoji$EmojiData, 'chart with downwards trend', 26, 31),
		A3($author$project$Emoji$EmojiData, 'bar chart', 26, 32),
		A3($author$project$Emoji$EmojiData, 'clipboard', 26, 33),
		A3($author$project$Emoji$EmojiData, 'pushpin', 26, 34),
		A3($author$project$Emoji$EmojiData, 'round pushpin', 26, 35),
		A3($author$project$Emoji$EmojiData, 'paperclip', 26, 36),
		A3($author$project$Emoji$EmojiData, 'straight ruler', 26, 37),
		A3($author$project$Emoji$EmojiData, 'triangular ruler', 26, 38),
		A3($author$project$Emoji$EmojiData, 'bookmark tabs', 26, 39),
		A3($author$project$Emoji$EmojiData, 'ledger', 26, 40),
		A3($author$project$Emoji$EmojiData, 'notebook', 26, 41),
		A3($author$project$Emoji$EmojiData, 'notebook with decorative cover', 26, 42),
		A3($author$project$Emoji$EmojiData, 'closed book', 26, 43),
		A3($author$project$Emoji$EmojiData, 'book', 26, 44),
		A3($author$project$Emoji$EmojiData, 'green book', 26, 45),
		A3($author$project$Emoji$EmojiData, 'blue book', 26, 46),
		A3($author$project$Emoji$EmojiData, 'orange book', 26, 47),
		A3($author$project$Emoji$EmojiData, 'books', 26, 48),
		A3($author$project$Emoji$EmojiData, 'name badge', 26, 49),
		A3($author$project$Emoji$EmojiData, 'scroll', 26, 50),
		A3($author$project$Emoji$EmojiData, 'memo', 26, 51),
		A3($author$project$Emoji$EmojiData, 'telephone receiver', 26, 52),
		A3($author$project$Emoji$EmojiData, 'pager', 26, 53),
		A3($author$project$Emoji$EmojiData, 'fax', 26, 54),
		A3($author$project$Emoji$EmojiData, 'satellite antenna', 26, 55),
		A3($author$project$Emoji$EmojiData, 'loudspeaker', 26, 56),
		A3($author$project$Emoji$EmojiData, 'mega', 27, 0),
		A3($author$project$Emoji$EmojiData, 'outbox tray', 27, 1),
		A3($author$project$Emoji$EmojiData, 'inbox tray', 27, 2),
		A3($author$project$Emoji$EmojiData, 'package', 27, 3),
		A3($author$project$Emoji$EmojiData, 'e mail', 27, 4),
		A3($author$project$Emoji$EmojiData, 'incoming envelope', 27, 5),
		A3($author$project$Emoji$EmojiData, 'envelope with arrow', 27, 6),
		A3($author$project$Emoji$EmojiData, 'mailbox closed', 27, 7),
		A3($author$project$Emoji$EmojiData, 'mailbox', 27, 8),
		A3($author$project$Emoji$EmojiData, 'mailbox with mail', 27, 9),
		A3($author$project$Emoji$EmojiData, 'mailbox with no mail', 27, 10),
		A3($author$project$Emoji$EmojiData, 'postbox', 27, 11),
		A3($author$project$Emoji$EmojiData, 'postal horn', 27, 12),
		A3($author$project$Emoji$EmojiData, 'newspaper', 27, 13),
		A3($author$project$Emoji$EmojiData, 'iphone', 27, 14),
		A3($author$project$Emoji$EmojiData, 'calling', 27, 15),
		A3($author$project$Emoji$EmojiData, 'vibration mode', 27, 16),
		A3($author$project$Emoji$EmojiData, 'mobile phone off', 27, 17),
		A3($author$project$Emoji$EmojiData, 'no mobile phones', 27, 18),
		A3($author$project$Emoji$EmojiData, 'signal strength', 27, 19),
		A3($author$project$Emoji$EmojiData, 'camera', 27, 20),
		A3($author$project$Emoji$EmojiData, 'camera with flash', 27, 21),
		A3($author$project$Emoji$EmojiData, 'video camera', 27, 22),
		A3($author$project$Emoji$EmojiData, 'tv', 27, 23),
		A3($author$project$Emoji$EmojiData, 'radio', 27, 24),
		A3($author$project$Emoji$EmojiData, 'vhs', 27, 25),
		A3($author$project$Emoji$EmojiData, 'film projector', 27, 26),
		A3($author$project$Emoji$EmojiData, 'prayer beads', 27, 27),
		A3($author$project$Emoji$EmojiData, 'twisted rightwards arrows', 27, 28),
		A3($author$project$Emoji$EmojiData, 'repeat', 27, 29),
		A3($author$project$Emoji$EmojiData, 'repeat one', 27, 30),
		A3($author$project$Emoji$EmojiData, 'arrows clockwise', 27, 31),
		A3($author$project$Emoji$EmojiData, 'arrows counterclockwise', 27, 32),
		A3($author$project$Emoji$EmojiData, 'low brightness', 27, 33),
		A3($author$project$Emoji$EmojiData, 'high brightness', 27, 34),
		A3($author$project$Emoji$EmojiData, 'mute', 27, 35),
		A3($author$project$Emoji$EmojiData, 'speaker', 27, 36),
		A3($author$project$Emoji$EmojiData, 'sound', 27, 37),
		A3($author$project$Emoji$EmojiData, 'loud sound', 27, 38),
		A3($author$project$Emoji$EmojiData, 'battery', 27, 39),
		A3($author$project$Emoji$EmojiData, 'electric plug', 27, 40),
		A3($author$project$Emoji$EmojiData, 'mag', 27, 41),
		A3($author$project$Emoji$EmojiData, 'mag right', 27, 42),
		A3($author$project$Emoji$EmojiData, 'lock with ink pen', 27, 43),
		A3($author$project$Emoji$EmojiData, 'closed lock with key', 27, 44),
		A3($author$project$Emoji$EmojiData, 'key', 27, 45),
		A3($author$project$Emoji$EmojiData, 'lock', 27, 46),
		A3($author$project$Emoji$EmojiData, 'unlock', 27, 47),
		A3($author$project$Emoji$EmojiData, 'bell', 27, 48),
		A3($author$project$Emoji$EmojiData, 'no bell', 27, 49),
		A3($author$project$Emoji$EmojiData, 'bookmark', 27, 50),
		A3($author$project$Emoji$EmojiData, 'link', 27, 51),
		A3($author$project$Emoji$EmojiData, 'radio button', 27, 52),
		A3($author$project$Emoji$EmojiData, 'back', 27, 53),
		A3($author$project$Emoji$EmojiData, 'end', 27, 54),
		A3($author$project$Emoji$EmojiData, 'on', 27, 55),
		A3($author$project$Emoji$EmojiData, 'soon', 27, 56),
		A3($author$project$Emoji$EmojiData, 'top', 28, 0),
		A3($author$project$Emoji$EmojiData, 'underage', 28, 1),
		A3($author$project$Emoji$EmojiData, 'keycap ten', 28, 2),
		A3($author$project$Emoji$EmojiData, 'capital abcd', 28, 3),
		A3($author$project$Emoji$EmojiData, 'abcd', 28, 4),
		A3($author$project$Emoji$EmojiData, '1234', 28, 5),
		A3($author$project$Emoji$EmojiData, 'symbols', 28, 6),
		A3($author$project$Emoji$EmojiData, 'abc', 28, 7),
		A3($author$project$Emoji$EmojiData, 'fire', 28, 8),
		A3($author$project$Emoji$EmojiData, 'flashlight', 28, 9),
		A3($author$project$Emoji$EmojiData, 'wrench', 28, 10),
		A3($author$project$Emoji$EmojiData, 'hammer', 28, 11),
		A3($author$project$Emoji$EmojiData, 'nut and bolt', 28, 12),
		A3($author$project$Emoji$EmojiData, 'hocho', 28, 13),
		A3($author$project$Emoji$EmojiData, 'gun', 28, 14),
		A3($author$project$Emoji$EmojiData, 'microscope', 28, 15),
		A3($author$project$Emoji$EmojiData, 'telescope', 28, 16),
		A3($author$project$Emoji$EmojiData, 'crystal ball', 28, 17),
		A3($author$project$Emoji$EmojiData, 'six pointed star', 28, 18),
		A3($author$project$Emoji$EmojiData, 'beginner', 28, 19),
		A3($author$project$Emoji$EmojiData, 'trident', 28, 20),
		A3($author$project$Emoji$EmojiData, 'black square button', 28, 21),
		A3($author$project$Emoji$EmojiData, 'white square button', 28, 22),
		A3($author$project$Emoji$EmojiData, 'red circle', 28, 23),
		A3($author$project$Emoji$EmojiData, 'large blue circle', 28, 24),
		A3($author$project$Emoji$EmojiData, 'large orange diamond', 28, 25),
		A3($author$project$Emoji$EmojiData, 'large blue diamond', 28, 26),
		A3($author$project$Emoji$EmojiData, 'small orange diamond', 28, 27),
		A3($author$project$Emoji$EmojiData, 'small blue diamond', 28, 28),
		A3($author$project$Emoji$EmojiData, 'small red triangle', 28, 29),
		A3($author$project$Emoji$EmojiData, 'small red triangle down', 28, 30),
		A3($author$project$Emoji$EmojiData, 'arrow up small', 28, 31),
		A3($author$project$Emoji$EmojiData, 'arrow down small', 28, 32),
		A3($author$project$Emoji$EmojiData, 'om symbol', 28, 33),
		A3($author$project$Emoji$EmojiData, 'dove of peace', 28, 34),
		A3($author$project$Emoji$EmojiData, 'kaaba', 28, 35),
		A3($author$project$Emoji$EmojiData, 'mosque', 28, 36),
		A3($author$project$Emoji$EmojiData, 'synagogue', 28, 37),
		A3($author$project$Emoji$EmojiData, 'menorah with nine branches', 28, 38),
		A3($author$project$Emoji$EmojiData, 'clock1', 28, 39),
		A3($author$project$Emoji$EmojiData, 'clock2', 28, 40),
		A3($author$project$Emoji$EmojiData, 'clock3', 28, 41),
		A3($author$project$Emoji$EmojiData, 'clock4', 28, 42),
		A3($author$project$Emoji$EmojiData, 'clock5', 28, 43),
		A3($author$project$Emoji$EmojiData, 'clock6', 28, 44),
		A3($author$project$Emoji$EmojiData, 'clock7', 28, 45),
		A3($author$project$Emoji$EmojiData, 'clock8', 28, 46),
		A3($author$project$Emoji$EmojiData, 'clock9', 28, 47),
		A3($author$project$Emoji$EmojiData, 'clock10', 28, 48),
		A3($author$project$Emoji$EmojiData, 'clock11', 28, 49),
		A3($author$project$Emoji$EmojiData, 'clock12', 28, 50),
		A3($author$project$Emoji$EmojiData, 'clock130', 28, 51),
		A3($author$project$Emoji$EmojiData, 'clock230', 28, 52),
		A3($author$project$Emoji$EmojiData, 'clock330', 28, 53),
		A3($author$project$Emoji$EmojiData, 'clock430', 28, 54),
		A3($author$project$Emoji$EmojiData, 'clock530', 28, 55),
		A3($author$project$Emoji$EmojiData, 'clock630', 28, 56),
		A3($author$project$Emoji$EmojiData, 'clock730', 29, 0),
		A3($author$project$Emoji$EmojiData, 'clock830', 29, 1),
		A3($author$project$Emoji$EmojiData, 'clock930', 29, 2),
		A3($author$project$Emoji$EmojiData, 'clock1030', 29, 3),
		A3($author$project$Emoji$EmojiData, 'clock1130', 29, 4),
		A3($author$project$Emoji$EmojiData, 'clock1230', 29, 5),
		A3($author$project$Emoji$EmojiData, 'candle', 29, 6),
		A3($author$project$Emoji$EmojiData, 'mantelpiece clock', 29, 7),
		A3($author$project$Emoji$EmojiData, 'hole', 29, 8),
		A3($author$project$Emoji$EmojiData, 'man in business suit levitating', 29, 9),
		A3($author$project$Emoji$EmojiData, 'female detective', 29, 15),
		A3($author$project$Emoji$EmojiData, 'male detective', 29, 21),
		A3($author$project$Emoji$EmojiData, 'sleuth or spy', 29, 27),
		A3($author$project$Emoji$EmojiData, 'dark sunglasses', 29, 33),
		A3($author$project$Emoji$EmojiData, 'spider', 29, 34),
		A3($author$project$Emoji$EmojiData, 'spider web', 29, 35),
		A3($author$project$Emoji$EmojiData, 'joystick', 29, 36),
		A3($author$project$Emoji$EmojiData, 'man dancing', 29, 37),
		A3($author$project$Emoji$EmojiData, 'linked paperclips', 29, 43),
		A3($author$project$Emoji$EmojiData, 'lower left ballpoint pen', 29, 44),
		A3($author$project$Emoji$EmojiData, 'lower left fountain pen', 29, 45),
		A3($author$project$Emoji$EmojiData, 'lower left paintbrush', 29, 46),
		A3($author$project$Emoji$EmojiData, 'lower left crayon', 29, 47),
		A3($author$project$Emoji$EmojiData, 'raised hand with fingers splayed', 29, 48),
		A3($author$project$Emoji$EmojiData, 'middle finger', 29, 54),
		A3($author$project$Emoji$EmojiData, 'spock hand', 30, 3),
		A3($author$project$Emoji$EmojiData, 'black heart', 30, 9),
		A3($author$project$Emoji$EmojiData, 'desktop computer', 30, 10),
		A3($author$project$Emoji$EmojiData, 'printer', 30, 11),
		A3($author$project$Emoji$EmojiData, 'three button mouse', 30, 12),
		A3($author$project$Emoji$EmojiData, 'trackball', 30, 13),
		A3($author$project$Emoji$EmojiData, 'frame with picture', 30, 14),
		A3($author$project$Emoji$EmojiData, 'card index dividers', 30, 15),
		A3($author$project$Emoji$EmojiData, 'card file box', 30, 16),
		A3($author$project$Emoji$EmojiData, 'file cabinet', 30, 17),
		A3($author$project$Emoji$EmojiData, 'wastebasket', 30, 18),
		A3($author$project$Emoji$EmojiData, 'spiral note pad', 30, 19),
		A3($author$project$Emoji$EmojiData, 'spiral calendar pad', 30, 20),
		A3($author$project$Emoji$EmojiData, 'compression', 30, 21),
		A3($author$project$Emoji$EmojiData, 'old key', 30, 22),
		A3($author$project$Emoji$EmojiData, 'rolled up newspaper', 30, 23),
		A3($author$project$Emoji$EmojiData, 'dagger knife', 30, 24),
		A3($author$project$Emoji$EmojiData, 'speaking head in silhouette', 30, 25),
		A3($author$project$Emoji$EmojiData, 'left speech bubble', 30, 26),
		A3($author$project$Emoji$EmojiData, 'right anger bubble', 30, 27),
		A3($author$project$Emoji$EmojiData, 'ballot box with ballot', 30, 28),
		A3($author$project$Emoji$EmojiData, 'world map', 30, 29),
		A3($author$project$Emoji$EmojiData, 'mount fuji', 30, 30),
		A3($author$project$Emoji$EmojiData, 'tokyo tower', 30, 31),
		A3($author$project$Emoji$EmojiData, 'statue of liberty', 30, 32),
		A3($author$project$Emoji$EmojiData, 'japan', 30, 33),
		A3($author$project$Emoji$EmojiData, 'moyai', 30, 34),
		A3($author$project$Emoji$EmojiData, 'grinning', 30, 35),
		A3($author$project$Emoji$EmojiData, 'grin', 30, 36),
		A3($author$project$Emoji$EmojiData, 'joy', 30, 37),
		A3($author$project$Emoji$EmojiData, 'smiley', 30, 38),
		A3($author$project$Emoji$EmojiData, 'smile', 30, 39),
		A3($author$project$Emoji$EmojiData, 'sweat smile', 30, 40),
		A3($author$project$Emoji$EmojiData, 'laughing', 30, 41),
		A3($author$project$Emoji$EmojiData, 'innocent', 30, 42),
		A3($author$project$Emoji$EmojiData, 'smiling imp', 30, 43),
		A3($author$project$Emoji$EmojiData, 'wink', 30, 44),
		A3($author$project$Emoji$EmojiData, 'blush', 30, 45),
		A3($author$project$Emoji$EmojiData, 'yum', 30, 46),
		A3($author$project$Emoji$EmojiData, 'relieved', 30, 47),
		A3($author$project$Emoji$EmojiData, 'heart eyes', 30, 48),
		A3($author$project$Emoji$EmojiData, 'sunglasses', 30, 49),
		A3($author$project$Emoji$EmojiData, 'smirk', 30, 50),
		A3($author$project$Emoji$EmojiData, 'neutral face', 30, 51),
		A3($author$project$Emoji$EmojiData, 'expressionless', 30, 52),
		A3($author$project$Emoji$EmojiData, 'unamused', 30, 53),
		A3($author$project$Emoji$EmojiData, 'sweat', 30, 54),
		A3($author$project$Emoji$EmojiData, 'pensive', 30, 55),
		A3($author$project$Emoji$EmojiData, 'confused', 30, 56),
		A3($author$project$Emoji$EmojiData, 'confounded', 31, 0),
		A3($author$project$Emoji$EmojiData, 'kissing', 31, 1),
		A3($author$project$Emoji$EmojiData, 'kissing heart', 31, 2),
		A3($author$project$Emoji$EmojiData, 'kissing smiling eyes', 31, 3),
		A3($author$project$Emoji$EmojiData, 'kissing closed eyes', 31, 4),
		A3($author$project$Emoji$EmojiData, 'stuck out tongue', 31, 5),
		A3($author$project$Emoji$EmojiData, 'stuck out tongue winking eye', 31, 6),
		A3($author$project$Emoji$EmojiData, 'stuck out tongue closed eyes', 31, 7),
		A3($author$project$Emoji$EmojiData, 'disappointed', 31, 8),
		A3($author$project$Emoji$EmojiData, 'worried', 31, 9),
		A3($author$project$Emoji$EmojiData, 'angry', 31, 10),
		A3($author$project$Emoji$EmojiData, 'rage', 31, 11),
		A3($author$project$Emoji$EmojiData, 'cry', 31, 12),
		A3($author$project$Emoji$EmojiData, 'persevere', 31, 13),
		A3($author$project$Emoji$EmojiData, 'triumph', 31, 14),
		A3($author$project$Emoji$EmojiData, 'disappointed relieved', 31, 15),
		A3($author$project$Emoji$EmojiData, 'frowning', 31, 16),
		A3($author$project$Emoji$EmojiData, 'anguished', 31, 17),
		A3($author$project$Emoji$EmojiData, 'fearful', 31, 18),
		A3($author$project$Emoji$EmojiData, 'weary', 31, 19),
		A3($author$project$Emoji$EmojiData, 'sleepy', 31, 20),
		A3($author$project$Emoji$EmojiData, 'tired face', 31, 21),
		A3($author$project$Emoji$EmojiData, 'grimacing', 31, 22),
		A3($author$project$Emoji$EmojiData, 'sob', 31, 23),
		A3($author$project$Emoji$EmojiData, 'open mouth', 31, 24),
		A3($author$project$Emoji$EmojiData, 'hushed', 31, 25),
		A3($author$project$Emoji$EmojiData, 'cold sweat', 31, 26),
		A3($author$project$Emoji$EmojiData, 'scream', 31, 27),
		A3($author$project$Emoji$EmojiData, 'astonished', 31, 28),
		A3($author$project$Emoji$EmojiData, 'flushed', 31, 29),
		A3($author$project$Emoji$EmojiData, 'sleeping', 31, 30),
		A3($author$project$Emoji$EmojiData, 'dizzy face', 31, 31),
		A3($author$project$Emoji$EmojiData, 'no mouth', 31, 32),
		A3($author$project$Emoji$EmojiData, 'mask', 31, 33),
		A3($author$project$Emoji$EmojiData, 'smile cat', 31, 34),
		A3($author$project$Emoji$EmojiData, 'joy cat', 31, 35),
		A3($author$project$Emoji$EmojiData, 'smiley cat', 31, 36),
		A3($author$project$Emoji$EmojiData, 'heart eyes cat', 31, 37),
		A3($author$project$Emoji$EmojiData, 'smirk cat', 31, 38),
		A3($author$project$Emoji$EmojiData, 'kissing cat', 31, 39),
		A3($author$project$Emoji$EmojiData, 'pouting cat', 31, 40),
		A3($author$project$Emoji$EmojiData, 'crying cat face', 31, 41),
		A3($author$project$Emoji$EmojiData, 'scream cat', 31, 42),
		A3($author$project$Emoji$EmojiData, 'slightly frowning face', 31, 43),
		A3($author$project$Emoji$EmojiData, 'slightly smiling face', 31, 44),
		A3($author$project$Emoji$EmojiData, 'upside down face', 31, 45),
		A3($author$project$Emoji$EmojiData, 'face with rolling eyes', 31, 46),
		A3($author$project$Emoji$EmojiData, 'woman gesturing no', 31, 47),
		A3($author$project$Emoji$EmojiData, 'man gesturing no', 31, 53),
		A3($author$project$Emoji$EmojiData, 'no good', 32, 2),
		A3($author$project$Emoji$EmojiData, 'woman gesturing ok', 32, 8),
		A3($author$project$Emoji$EmojiData, 'man gesturing ok', 32, 14),
		A3($author$project$Emoji$EmojiData, 'ok woman', 32, 20),
		A3($author$project$Emoji$EmojiData, 'woman bowing', 32, 26),
		A3($author$project$Emoji$EmojiData, 'man bowing', 32, 32),
		A3($author$project$Emoji$EmojiData, 'bow', 32, 38),
		A3($author$project$Emoji$EmojiData, 'see no evil', 32, 44),
		A3($author$project$Emoji$EmojiData, 'hear no evil', 32, 45),
		A3($author$project$Emoji$EmojiData, 'speak no evil', 32, 46),
		A3($author$project$Emoji$EmojiData, 'woman raising hand', 32, 47),
		A3($author$project$Emoji$EmojiData, 'man raising hand', 32, 53),
		A3($author$project$Emoji$EmojiData, 'raising hand', 33, 2),
		A3($author$project$Emoji$EmojiData, 'raised hands', 33, 8),
		A3($author$project$Emoji$EmojiData, 'woman frowning', 33, 14),
		A3($author$project$Emoji$EmojiData, 'man frowning', 33, 20),
		A3($author$project$Emoji$EmojiData, 'person frowning', 33, 26),
		A3($author$project$Emoji$EmojiData, 'woman pouting', 33, 32),
		A3($author$project$Emoji$EmojiData, 'man pouting', 33, 38),
		A3($author$project$Emoji$EmojiData, 'person with pouting face', 33, 44),
		A3($author$project$Emoji$EmojiData, 'pray', 33, 50),
		A3($author$project$Emoji$EmojiData, 'rocket', 33, 56),
		A3($author$project$Emoji$EmojiData, 'helicopter', 34, 0),
		A3($author$project$Emoji$EmojiData, 'steam locomotive', 34, 1),
		A3($author$project$Emoji$EmojiData, 'railway car', 34, 2),
		A3($author$project$Emoji$EmojiData, 'bullettrain side', 34, 3),
		A3($author$project$Emoji$EmojiData, 'bullettrain front', 34, 4),
		A3($author$project$Emoji$EmojiData, 'train2', 34, 5),
		A3($author$project$Emoji$EmojiData, 'metro', 34, 6),
		A3($author$project$Emoji$EmojiData, 'light rail', 34, 7),
		A3($author$project$Emoji$EmojiData, 'station', 34, 8),
		A3($author$project$Emoji$EmojiData, 'tram', 34, 9),
		A3($author$project$Emoji$EmojiData, 'train', 34, 10),
		A3($author$project$Emoji$EmojiData, 'bus', 34, 11),
		A3($author$project$Emoji$EmojiData, 'oncoming bus', 34, 12),
		A3($author$project$Emoji$EmojiData, 'trolleybus', 34, 13),
		A3($author$project$Emoji$EmojiData, 'busstop', 34, 14),
		A3($author$project$Emoji$EmojiData, 'minibus', 34, 15),
		A3($author$project$Emoji$EmojiData, 'ambulance', 34, 16),
		A3($author$project$Emoji$EmojiData, 'fire engine', 34, 17),
		A3($author$project$Emoji$EmojiData, 'police car', 34, 18),
		A3($author$project$Emoji$EmojiData, 'oncoming police car', 34, 19),
		A3($author$project$Emoji$EmojiData, 'taxi', 34, 20),
		A3($author$project$Emoji$EmojiData, 'oncoming taxi', 34, 21),
		A3($author$project$Emoji$EmojiData, 'car', 34, 22),
		A3($author$project$Emoji$EmojiData, 'oncoming automobile', 34, 23),
		A3($author$project$Emoji$EmojiData, 'blue car', 34, 24),
		A3($author$project$Emoji$EmojiData, 'truck', 34, 25),
		A3($author$project$Emoji$EmojiData, 'articulated lorry', 34, 26),
		A3($author$project$Emoji$EmojiData, 'tractor', 34, 27),
		A3($author$project$Emoji$EmojiData, 'monorail', 34, 28),
		A3($author$project$Emoji$EmojiData, 'mountain railway', 34, 29),
		A3($author$project$Emoji$EmojiData, 'suspension railway', 34, 30),
		A3($author$project$Emoji$EmojiData, 'mountain cableway', 34, 31),
		A3($author$project$Emoji$EmojiData, 'aerial tramway', 34, 32),
		A3($author$project$Emoji$EmojiData, 'ship', 34, 33),
		A3($author$project$Emoji$EmojiData, 'woman rowing boat', 34, 34),
		A3($author$project$Emoji$EmojiData, 'man rowing boat', 34, 40),
		A3($author$project$Emoji$EmojiData, 'rowboat', 34, 46),
		A3($author$project$Emoji$EmojiData, 'speedboat', 34, 52),
		A3($author$project$Emoji$EmojiData, 'traffic light', 34, 53),
		A3($author$project$Emoji$EmojiData, 'vertical traffic light', 34, 54),
		A3($author$project$Emoji$EmojiData, 'construction', 34, 55),
		A3($author$project$Emoji$EmojiData, 'rotating light', 34, 56),
		A3($author$project$Emoji$EmojiData, 'triangular flag on post', 35, 0),
		A3($author$project$Emoji$EmojiData, 'door', 35, 1),
		A3($author$project$Emoji$EmojiData, 'no entry sign', 35, 2),
		A3($author$project$Emoji$EmojiData, 'smoking', 35, 3),
		A3($author$project$Emoji$EmojiData, 'no smoking', 35, 4),
		A3($author$project$Emoji$EmojiData, 'put litter in its place', 35, 5),
		A3($author$project$Emoji$EmojiData, 'do not litter', 35, 6),
		A3($author$project$Emoji$EmojiData, 'potable water', 35, 7),
		A3($author$project$Emoji$EmojiData, 'non potable water', 35, 8),
		A3($author$project$Emoji$EmojiData, 'bike', 35, 9),
		A3($author$project$Emoji$EmojiData, 'no bicycles', 35, 10),
		A3($author$project$Emoji$EmojiData, 'woman biking', 35, 11),
		A3($author$project$Emoji$EmojiData, 'man biking', 35, 17),
		A3($author$project$Emoji$EmojiData, 'bicyclist', 35, 23),
		A3($author$project$Emoji$EmojiData, 'woman mountain biking', 35, 29),
		A3($author$project$Emoji$EmojiData, 'man mountain biking', 35, 35),
		A3($author$project$Emoji$EmojiData, 'mountain bicyclist', 35, 41),
		A3($author$project$Emoji$EmojiData, 'woman walking', 35, 47),
		A3($author$project$Emoji$EmojiData, 'man walking', 35, 53),
		A3($author$project$Emoji$EmojiData, 'walking', 36, 2),
		A3($author$project$Emoji$EmojiData, 'no pedestrians', 36, 8),
		A3($author$project$Emoji$EmojiData, 'children crossing', 36, 9),
		A3($author$project$Emoji$EmojiData, 'mens', 36, 10),
		A3($author$project$Emoji$EmojiData, 'womens', 36, 11),
		A3($author$project$Emoji$EmojiData, 'restroom', 36, 12),
		A3($author$project$Emoji$EmojiData, 'baby symbol', 36, 13),
		A3($author$project$Emoji$EmojiData, 'toilet', 36, 14),
		A3($author$project$Emoji$EmojiData, 'wc', 36, 15),
		A3($author$project$Emoji$EmojiData, 'shower', 36, 16),
		A3($author$project$Emoji$EmojiData, 'bath', 36, 17),
		A3($author$project$Emoji$EmojiData, 'bathtub', 36, 23),
		A3($author$project$Emoji$EmojiData, 'passport control', 36, 24),
		A3($author$project$Emoji$EmojiData, 'customs', 36, 25),
		A3($author$project$Emoji$EmojiData, 'baggage claim', 36, 26),
		A3($author$project$Emoji$EmojiData, 'left luggage', 36, 27),
		A3($author$project$Emoji$EmojiData, 'couch and lamp', 36, 28),
		A3($author$project$Emoji$EmojiData, 'sleeping accommodation', 36, 29),
		A3($author$project$Emoji$EmojiData, 'shopping bags', 36, 35),
		A3($author$project$Emoji$EmojiData, 'bellhop bell', 36, 36),
		A3($author$project$Emoji$EmojiData, 'bed', 36, 37),
		A3($author$project$Emoji$EmojiData, 'place of worship', 36, 38),
		A3($author$project$Emoji$EmojiData, 'octagonal sign', 36, 39),
		A3($author$project$Emoji$EmojiData, 'shopping trolley', 36, 40),
		A3($author$project$Emoji$EmojiData, 'hindu temple', 36, 41),
		A3($author$project$Emoji$EmojiData, 'hammer and wrench', 36, 42),
		A3($author$project$Emoji$EmojiData, 'shield', 36, 43),
		A3($author$project$Emoji$EmojiData, 'oil drum', 36, 44),
		A3($author$project$Emoji$EmojiData, 'motorway', 36, 45),
		A3($author$project$Emoji$EmojiData, 'railway track', 36, 46),
		A3($author$project$Emoji$EmojiData, 'motor boat', 36, 47),
		A3($author$project$Emoji$EmojiData, 'small airplane', 36, 48),
		A3($author$project$Emoji$EmojiData, 'airplane departure', 36, 49),
		A3($author$project$Emoji$EmojiData, 'airplane arriving', 36, 50),
		A3($author$project$Emoji$EmojiData, 'satellite', 36, 51),
		A3($author$project$Emoji$EmojiData, 'passenger ship', 36, 52),
		A3($author$project$Emoji$EmojiData, 'scooter', 36, 53),
		A3($author$project$Emoji$EmojiData, 'motor scooter', 36, 54),
		A3($author$project$Emoji$EmojiData, 'canoe', 36, 55),
		A3($author$project$Emoji$EmojiData, 'sled', 36, 56),
		A3($author$project$Emoji$EmojiData, 'flying saucer', 37, 0),
		A3($author$project$Emoji$EmojiData, 'skateboard', 37, 1),
		A3($author$project$Emoji$EmojiData, 'auto rickshaw', 37, 2),
		A3($author$project$Emoji$EmojiData, 'large orange circle', 37, 3),
		A3($author$project$Emoji$EmojiData, 'large yellow circle', 37, 4),
		A3($author$project$Emoji$EmojiData, 'large green circle', 37, 5),
		A3($author$project$Emoji$EmojiData, 'large purple circle', 37, 6),
		A3($author$project$Emoji$EmojiData, 'large brown circle', 37, 7),
		A3($author$project$Emoji$EmojiData, 'large red square', 37, 8),
		A3($author$project$Emoji$EmojiData, 'large blue square', 37, 9),
		A3($author$project$Emoji$EmojiData, 'large orange square', 37, 10),
		A3($author$project$Emoji$EmojiData, 'large yellow square', 37, 11),
		A3($author$project$Emoji$EmojiData, 'large green square', 37, 12),
		A3($author$project$Emoji$EmojiData, 'large purple square', 37, 13),
		A3($author$project$Emoji$EmojiData, 'large brown square', 37, 14),
		A3($author$project$Emoji$EmojiData, 'white heart', 37, 15),
		A3($author$project$Emoji$EmojiData, 'brown heart', 37, 16),
		A3($author$project$Emoji$EmojiData, 'pinching hand', 37, 17),
		A3($author$project$Emoji$EmojiData, 'zipper mouth face', 37, 23),
		A3($author$project$Emoji$EmojiData, 'money mouth face', 37, 24),
		A3($author$project$Emoji$EmojiData, 'face with thermometer', 37, 25),
		A3($author$project$Emoji$EmojiData, 'nerd face', 37, 26),
		A3($author$project$Emoji$EmojiData, 'thinking face', 37, 27),
		A3($author$project$Emoji$EmojiData, 'face with head bandage', 37, 28),
		A3($author$project$Emoji$EmojiData, 'robot face', 37, 29),
		A3($author$project$Emoji$EmojiData, 'hugging face', 37, 30),
		A3($author$project$Emoji$EmojiData, 'the horns', 37, 31),
		A3($author$project$Emoji$EmojiData, 'call me hand', 37, 37),
		A3($author$project$Emoji$EmojiData, 'raised back of hand', 37, 43),
		A3($author$project$Emoji$EmojiData, 'left facing fist', 37, 49),
		A3($author$project$Emoji$EmojiData, 'right facing fist', 37, 55),
		A3($author$project$Emoji$EmojiData, 'handshake', 38, 4),
		A3($author$project$Emoji$EmojiData, 'crossed fingers', 38, 5),
		A3($author$project$Emoji$EmojiData, 'i love you hand sign', 38, 11),
		A3($author$project$Emoji$EmojiData, 'face with cowboy hat', 38, 17),
		A3($author$project$Emoji$EmojiData, 'clown face', 38, 18),
		A3($author$project$Emoji$EmojiData, 'nauseated face', 38, 19),
		A3($author$project$Emoji$EmojiData, 'rolling on the floor laughing', 38, 20),
		A3($author$project$Emoji$EmojiData, 'drooling face', 38, 21),
		A3($author$project$Emoji$EmojiData, 'lying face', 38, 22),
		A3($author$project$Emoji$EmojiData, 'woman facepalming', 38, 23),
		A3($author$project$Emoji$EmojiData, 'man facepalming', 38, 29),
		A3($author$project$Emoji$EmojiData, 'face palm', 38, 35),
		A3($author$project$Emoji$EmojiData, 'sneezing face', 38, 41),
		A3($author$project$Emoji$EmojiData, 'face with raised eyebrow', 38, 42),
		A3($author$project$Emoji$EmojiData, 'star struck', 38, 43),
		A3($author$project$Emoji$EmojiData, 'zany face', 38, 44),
		A3($author$project$Emoji$EmojiData, 'shushing face', 38, 45),
		A3($author$project$Emoji$EmojiData, 'face with symbols on mouth', 38, 46),
		A3($author$project$Emoji$EmojiData, 'face with hand over mouth', 38, 47),
		A3($author$project$Emoji$EmojiData, 'face vomiting', 38, 48),
		A3($author$project$Emoji$EmojiData, 'exploding head', 38, 49),
		A3($author$project$Emoji$EmojiData, 'pregnant woman', 38, 50),
		A3($author$project$Emoji$EmojiData, 'breast feeding', 38, 56),
		A3($author$project$Emoji$EmojiData, 'palms up together', 39, 5),
		A3($author$project$Emoji$EmojiData, 'selfie', 39, 11),
		A3($author$project$Emoji$EmojiData, 'prince', 39, 17),
		A3($author$project$Emoji$EmojiData, 'man in tuxedo', 39, 23),
		A3($author$project$Emoji$EmojiData, 'mrs claus', 39, 29),
		A3($author$project$Emoji$EmojiData, 'woman shrugging', 39, 35),
		A3($author$project$Emoji$EmojiData, 'man shrugging', 39, 41),
		A3($author$project$Emoji$EmojiData, 'shrug', 39, 47),
		A3($author$project$Emoji$EmojiData, 'woman cartwheeling', 39, 53),
		A3($author$project$Emoji$EmojiData, 'man cartwheeling', 40, 2),
		A3($author$project$Emoji$EmojiData, 'person doing cartwheel', 40, 8),
		A3($author$project$Emoji$EmojiData, 'woman juggling', 40, 14),
		A3($author$project$Emoji$EmojiData, 'man juggling', 40, 20),
		A3($author$project$Emoji$EmojiData, 'juggling', 40, 26),
		A3($author$project$Emoji$EmojiData, 'fencer', 40, 32),
		A3($author$project$Emoji$EmojiData, 'woman wrestling', 40, 33),
		A3($author$project$Emoji$EmojiData, 'man wrestling', 40, 34),
		A3($author$project$Emoji$EmojiData, 'wrestlers', 40, 35),
		A3($author$project$Emoji$EmojiData, 'woman playing water polo', 40, 36),
		A3($author$project$Emoji$EmojiData, 'man playing water polo', 40, 42),
		A3($author$project$Emoji$EmojiData, 'water polo', 40, 48),
		A3($author$project$Emoji$EmojiData, 'woman playing handball', 40, 54),
		A3($author$project$Emoji$EmojiData, 'man playing handball', 41, 3),
		A3($author$project$Emoji$EmojiData, 'handball', 41, 9),
		A3($author$project$Emoji$EmojiData, 'diving mask', 41, 15),
		A3($author$project$Emoji$EmojiData, 'wilted flower', 41, 16),
		A3($author$project$Emoji$EmojiData, 'drum with drumsticks', 41, 17),
		A3($author$project$Emoji$EmojiData, 'clinking glasses', 41, 18),
		A3($author$project$Emoji$EmojiData, 'tumbler glass', 41, 19),
		A3($author$project$Emoji$EmojiData, 'spoon', 41, 20),
		A3($author$project$Emoji$EmojiData, 'goal net', 41, 21),
		A3($author$project$Emoji$EmojiData, 'first place medal', 41, 22),
		A3($author$project$Emoji$EmojiData, 'second place medal', 41, 23),
		A3($author$project$Emoji$EmojiData, 'third place medal', 41, 24),
		A3($author$project$Emoji$EmojiData, 'boxing glove', 41, 25),
		A3($author$project$Emoji$EmojiData, 'martial arts uniform', 41, 26),
		A3($author$project$Emoji$EmojiData, 'curling stone', 41, 27),
		A3($author$project$Emoji$EmojiData, 'lacrosse', 41, 28),
		A3($author$project$Emoji$EmojiData, 'softball', 41, 29),
		A3($author$project$Emoji$EmojiData, 'flying disc', 41, 30),
		A3($author$project$Emoji$EmojiData, 'croissant', 41, 31),
		A3($author$project$Emoji$EmojiData, 'avocado', 41, 32),
		A3($author$project$Emoji$EmojiData, 'cucumber', 41, 33),
		A3($author$project$Emoji$EmojiData, 'bacon', 41, 34),
		A3($author$project$Emoji$EmojiData, 'potato', 41, 35),
		A3($author$project$Emoji$EmojiData, 'carrot', 41, 36),
		A3($author$project$Emoji$EmojiData, 'baguette bread', 41, 37),
		A3($author$project$Emoji$EmojiData, 'green salad', 41, 38),
		A3($author$project$Emoji$EmojiData, 'shallow pan of food', 41, 39),
		A3($author$project$Emoji$EmojiData, 'stuffed flatbread', 41, 40),
		A3($author$project$Emoji$EmojiData, 'egg', 41, 41),
		A3($author$project$Emoji$EmojiData, 'glass of milk', 41, 42),
		A3($author$project$Emoji$EmojiData, 'peanuts', 41, 43),
		A3($author$project$Emoji$EmojiData, 'kiwifruit', 41, 44),
		A3($author$project$Emoji$EmojiData, 'pancakes', 41, 45),
		A3($author$project$Emoji$EmojiData, 'dumpling', 41, 46),
		A3($author$project$Emoji$EmojiData, 'fortune cookie', 41, 47),
		A3($author$project$Emoji$EmojiData, 'takeout box', 41, 48),
		A3($author$project$Emoji$EmojiData, 'chopsticks', 41, 49),
		A3($author$project$Emoji$EmojiData, 'bowl with spoon', 41, 50),
		A3($author$project$Emoji$EmojiData, 'cup with straw', 41, 51),
		A3($author$project$Emoji$EmojiData, 'coconut', 41, 52),
		A3($author$project$Emoji$EmojiData, 'broccoli', 41, 53),
		A3($author$project$Emoji$EmojiData, 'pie', 41, 54),
		A3($author$project$Emoji$EmojiData, 'pretzel', 41, 55),
		A3($author$project$Emoji$EmojiData, 'cut of meat', 41, 56),
		A3($author$project$Emoji$EmojiData, 'sandwich', 42, 0),
		A3($author$project$Emoji$EmojiData, 'canned food', 42, 1),
		A3($author$project$Emoji$EmojiData, 'leafy green', 42, 2),
		A3($author$project$Emoji$EmojiData, 'mango', 42, 3),
		A3($author$project$Emoji$EmojiData, 'moon cake', 42, 4),
		A3($author$project$Emoji$EmojiData, 'bagel', 42, 5),
		A3($author$project$Emoji$EmojiData, 'smiling face with 3 hearts', 42, 6),
		A3($author$project$Emoji$EmojiData, 'yawning face', 42, 7),
		A3($author$project$Emoji$EmojiData, 'partying face', 42, 8),
		A3($author$project$Emoji$EmojiData, 'woozy face', 42, 9),
		A3($author$project$Emoji$EmojiData, 'hot face', 42, 10),
		A3($author$project$Emoji$EmojiData, 'cold face', 42, 11),
		A3($author$project$Emoji$EmojiData, 'pleading face', 42, 12),
		A3($author$project$Emoji$EmojiData, 'sari', 42, 13),
		A3($author$project$Emoji$EmojiData, 'lab coat', 42, 14),
		A3($author$project$Emoji$EmojiData, 'goggles', 42, 15),
		A3($author$project$Emoji$EmojiData, 'hiking boot', 42, 16),
		A3($author$project$Emoji$EmojiData, 'womans flat shoe', 42, 17),
		A3($author$project$Emoji$EmojiData, 'crab', 42, 18),
		A3($author$project$Emoji$EmojiData, 'lion face', 42, 19),
		A3($author$project$Emoji$EmojiData, 'scorpion', 42, 20),
		A3($author$project$Emoji$EmojiData, 'turkey', 42, 21),
		A3($author$project$Emoji$EmojiData, 'unicorn face', 42, 22),
		A3($author$project$Emoji$EmojiData, 'eagle', 42, 23),
		A3($author$project$Emoji$EmojiData, 'duck', 42, 24),
		A3($author$project$Emoji$EmojiData, 'bat', 42, 25),
		A3($author$project$Emoji$EmojiData, 'shark', 42, 26),
		A3($author$project$Emoji$EmojiData, 'owl', 42, 27),
		A3($author$project$Emoji$EmojiData, 'fox face', 42, 28),
		A3($author$project$Emoji$EmojiData, 'butterfly', 42, 29),
		A3($author$project$Emoji$EmojiData, 'deer', 42, 30),
		A3($author$project$Emoji$EmojiData, 'gorilla', 42, 31),
		A3($author$project$Emoji$EmojiData, 'lizard', 42, 32),
		A3($author$project$Emoji$EmojiData, 'rhinoceros', 42, 33),
		A3($author$project$Emoji$EmojiData, 'shrimp', 42, 34),
		A3($author$project$Emoji$EmojiData, 'squid', 42, 35),
		A3($author$project$Emoji$EmojiData, 'giraffe face', 42, 36),
		A3($author$project$Emoji$EmojiData, 'zebra face', 42, 37),
		A3($author$project$Emoji$EmojiData, 'hedgehog', 42, 38),
		A3($author$project$Emoji$EmojiData, 'sauropod', 42, 39),
		A3($author$project$Emoji$EmojiData, 't rex', 42, 40),
		A3($author$project$Emoji$EmojiData, 'cricket', 42, 41),
		A3($author$project$Emoji$EmojiData, 'kangaroo', 42, 42),
		A3($author$project$Emoji$EmojiData, 'llama', 42, 43),
		A3($author$project$Emoji$EmojiData, 'peacock', 42, 44),
		A3($author$project$Emoji$EmojiData, 'hippopotamus', 42, 45),
		A3($author$project$Emoji$EmojiData, 'parrot', 42, 46),
		A3($author$project$Emoji$EmojiData, 'raccoon', 42, 47),
		A3($author$project$Emoji$EmojiData, 'lobster', 42, 48),
		A3($author$project$Emoji$EmojiData, 'mosquito', 42, 49),
		A3($author$project$Emoji$EmojiData, 'microbe', 42, 50),
		A3($author$project$Emoji$EmojiData, 'badger', 42, 51),
		A3($author$project$Emoji$EmojiData, 'swan', 42, 52),
		A3($author$project$Emoji$EmojiData, 'sloth', 42, 53),
		A3($author$project$Emoji$EmojiData, 'otter', 42, 54),
		A3($author$project$Emoji$EmojiData, 'orangutan', 42, 55),
		A3($author$project$Emoji$EmojiData, 'skunk', 42, 56),
		A3($author$project$Emoji$EmojiData, 'flamingo', 43, 0),
		A3($author$project$Emoji$EmojiData, 'oyster', 43, 1),
		A3($author$project$Emoji$EmojiData, 'guide dog', 43, 2),
		A3($author$project$Emoji$EmojiData, 'probing cane', 43, 3),
		A3($author$project$Emoji$EmojiData, 'bone', 43, 4),
		A3($author$project$Emoji$EmojiData, 'leg', 43, 5),
		A3($author$project$Emoji$EmojiData, 'foot', 43, 11),
		A3($author$project$Emoji$EmojiData, 'tooth', 43, 17),
		A3($author$project$Emoji$EmojiData, 'female superhero', 43, 18),
		A3($author$project$Emoji$EmojiData, 'male superhero', 43, 24),
		A3($author$project$Emoji$EmojiData, 'superhero', 43, 30),
		A3($author$project$Emoji$EmojiData, 'female supervillain', 43, 36),
		A3($author$project$Emoji$EmojiData, 'male supervillain', 43, 42),
		A3($author$project$Emoji$EmojiData, 'supervillain', 43, 48),
		A3($author$project$Emoji$EmojiData, 'safety vest', 43, 54),
		A3($author$project$Emoji$EmojiData, 'ear with hearing aid', 43, 55),
		A3($author$project$Emoji$EmojiData, 'motorized wheelchair', 44, 4),
		A3($author$project$Emoji$EmojiData, 'manual wheelchair', 44, 5),
		A3($author$project$Emoji$EmojiData, 'mechanical arm', 44, 6),
		A3($author$project$Emoji$EmojiData, 'mechanical leg', 44, 7),
		A3($author$project$Emoji$EmojiData, 'cheese wedge', 44, 8),
		A3($author$project$Emoji$EmojiData, 'cupcake', 44, 9),
		A3($author$project$Emoji$EmojiData, 'salt', 44, 10),
		A3($author$project$Emoji$EmojiData, 'beverage box', 44, 11),
		A3($author$project$Emoji$EmojiData, 'garlic', 44, 12),
		A3($author$project$Emoji$EmojiData, 'onion', 44, 13),
		A3($author$project$Emoji$EmojiData, 'falafel', 44, 14),
		A3($author$project$Emoji$EmojiData, 'waffle', 44, 15),
		A3($author$project$Emoji$EmojiData, 'butter', 44, 16),
		A3($author$project$Emoji$EmojiData, 'mate drink', 44, 17),
		A3($author$project$Emoji$EmojiData, 'ice cube', 44, 18),
		A3($author$project$Emoji$EmojiData, 'woman standing', 44, 19),
		A3($author$project$Emoji$EmojiData, 'man standing', 44, 25),
		A3($author$project$Emoji$EmojiData, 'standing person', 44, 31),
		A3($author$project$Emoji$EmojiData, 'woman kneeling', 44, 37),
		A3($author$project$Emoji$EmojiData, 'man kneeling', 44, 43),
		A3($author$project$Emoji$EmojiData, 'kneeling person', 44, 49),
		A3($author$project$Emoji$EmojiData, 'deaf woman', 44, 55),
		A3($author$project$Emoji$EmojiData, 'deaf man', 45, 4),
		A3($author$project$Emoji$EmojiData, 'deaf person', 45, 10),
		A3($author$project$Emoji$EmojiData, 'face with monocle', 45, 16),
		A3($author$project$Emoji$EmojiData, 'farmer', 45, 17),
		A3($author$project$Emoji$EmojiData, 'cook', 45, 23),
		A3($author$project$Emoji$EmojiData, 'student', 45, 29),
		A3($author$project$Emoji$EmojiData, 'singer', 45, 35),
		A3($author$project$Emoji$EmojiData, 'artist', 45, 41),
		A3($author$project$Emoji$EmojiData, 'teacher', 45, 47),
		A3($author$project$Emoji$EmojiData, 'factory worker', 45, 53),
		A3($author$project$Emoji$EmojiData, 'technologist', 46, 2),
		A3($author$project$Emoji$EmojiData, 'office worker', 46, 8),
		A3($author$project$Emoji$EmojiData, 'mechanic', 46, 14),
		A3($author$project$Emoji$EmojiData, 'scientist', 46, 20),
		A3($author$project$Emoji$EmojiData, 'astronaut', 46, 26),
		A3($author$project$Emoji$EmojiData, 'firefighter', 46, 32),
		A3($author$project$Emoji$EmojiData, 'people holding hands', 46, 38),
		A3($author$project$Emoji$EmojiData, 'person with probing cane', 47, 7),
		A3($author$project$Emoji$EmojiData, 'red haired person', 47, 13),
		A3($author$project$Emoji$EmojiData, 'curly haired person', 47, 19),
		A3($author$project$Emoji$EmojiData, 'bald person', 47, 25),
		A3($author$project$Emoji$EmojiData, 'white haired person', 47, 31),
		A3($author$project$Emoji$EmojiData, 'person in motorized wheelchair', 47, 37),
		A3($author$project$Emoji$EmojiData, 'person in manual wheelchair', 47, 43),
		A3($author$project$Emoji$EmojiData, 'health worker', 47, 49),
		A3($author$project$Emoji$EmojiData, 'judge', 47, 55),
		A3($author$project$Emoji$EmojiData, 'pilot', 48, 4),
		A3($author$project$Emoji$EmojiData, 'adult', 48, 10),
		A3($author$project$Emoji$EmojiData, 'child', 48, 16),
		A3($author$project$Emoji$EmojiData, 'older adult', 48, 22),
		A3($author$project$Emoji$EmojiData, 'bearded person', 48, 28),
		A3($author$project$Emoji$EmojiData, 'person with headscarf', 48, 34),
		A3($author$project$Emoji$EmojiData, 'woman in steamy room', 48, 40),
		A3($author$project$Emoji$EmojiData, 'man in steamy room', 48, 46),
		A3($author$project$Emoji$EmojiData, 'person in steamy room', 48, 52),
		A3($author$project$Emoji$EmojiData, 'woman climbing', 49, 1),
		A3($author$project$Emoji$EmojiData, 'man climbing', 49, 7),
		A3($author$project$Emoji$EmojiData, 'person climbing', 49, 13),
		A3($author$project$Emoji$EmojiData, 'woman in lotus position', 49, 19),
		A3($author$project$Emoji$EmojiData, 'man in lotus position', 49, 25),
		A3($author$project$Emoji$EmojiData, 'person in lotus position', 49, 31),
		A3($author$project$Emoji$EmojiData, 'female mage', 49, 37),
		A3($author$project$Emoji$EmojiData, 'male mage', 49, 43),
		A3($author$project$Emoji$EmojiData, 'mage', 49, 49),
		A3($author$project$Emoji$EmojiData, 'female fairy', 49, 55),
		A3($author$project$Emoji$EmojiData, 'male fairy', 50, 4),
		A3($author$project$Emoji$EmojiData, 'fairy', 50, 10),
		A3($author$project$Emoji$EmojiData, 'female vampire', 50, 16),
		A3($author$project$Emoji$EmojiData, 'male vampire', 50, 22),
		A3($author$project$Emoji$EmojiData, 'vampire', 50, 28),
		A3($author$project$Emoji$EmojiData, 'mermaid', 50, 34),
		A3($author$project$Emoji$EmojiData, 'merman', 50, 40),
		A3($author$project$Emoji$EmojiData, 'merperson', 50, 46),
		A3($author$project$Emoji$EmojiData, 'female elf', 50, 52),
		A3($author$project$Emoji$EmojiData, 'male elf', 51, 1),
		A3($author$project$Emoji$EmojiData, 'elf', 51, 7),
		A3($author$project$Emoji$EmojiData, 'female genie', 51, 13),
		A3($author$project$Emoji$EmojiData, 'male genie', 51, 14),
		A3($author$project$Emoji$EmojiData, 'genie', 51, 15),
		A3($author$project$Emoji$EmojiData, 'female zombie', 51, 16),
		A3($author$project$Emoji$EmojiData, 'male zombie', 51, 17),
		A3($author$project$Emoji$EmojiData, 'zombie', 51, 18),
		A3($author$project$Emoji$EmojiData, 'brain', 51, 19),
		A3($author$project$Emoji$EmojiData, 'orange heart', 51, 20),
		A3($author$project$Emoji$EmojiData, 'billed cap', 51, 21),
		A3($author$project$Emoji$EmojiData, 'scarf', 51, 22),
		A3($author$project$Emoji$EmojiData, 'gloves', 51, 23),
		A3($author$project$Emoji$EmojiData, 'coat', 51, 24),
		A3($author$project$Emoji$EmojiData, 'socks', 51, 25),
		A3($author$project$Emoji$EmojiData, 'red envelope', 51, 26),
		A3($author$project$Emoji$EmojiData, 'firecracker', 51, 27),
		A3($author$project$Emoji$EmojiData, 'jigsaw', 51, 28),
		A3($author$project$Emoji$EmojiData, 'test tube', 51, 29),
		A3($author$project$Emoji$EmojiData, 'petri dish', 51, 30),
		A3($author$project$Emoji$EmojiData, 'dna', 51, 31),
		A3($author$project$Emoji$EmojiData, 'compass', 51, 32),
		A3($author$project$Emoji$EmojiData, 'abacus', 51, 33),
		A3($author$project$Emoji$EmojiData, 'fire extinguisher', 51, 34),
		A3($author$project$Emoji$EmojiData, 'toolbox', 51, 35),
		A3($author$project$Emoji$EmojiData, 'bricks', 51, 36),
		A3($author$project$Emoji$EmojiData, 'magnet', 51, 37),
		A3($author$project$Emoji$EmojiData, 'luggage', 51, 38),
		A3($author$project$Emoji$EmojiData, 'lotion bottle', 51, 39),
		A3($author$project$Emoji$EmojiData, 'thread', 51, 40),
		A3($author$project$Emoji$EmojiData, 'yarn', 51, 41),
		A3($author$project$Emoji$EmojiData, 'safety pin', 51, 42),
		A3($author$project$Emoji$EmojiData, 'teddy bear', 51, 43),
		A3($author$project$Emoji$EmojiData, 'broom', 51, 44),
		A3($author$project$Emoji$EmojiData, 'basket', 51, 45),
		A3($author$project$Emoji$EmojiData, 'roll of paper', 51, 46),
		A3($author$project$Emoji$EmojiData, 'soap', 51, 47),
		A3($author$project$Emoji$EmojiData, 'sponge', 51, 48),
		A3($author$project$Emoji$EmojiData, 'receipt', 51, 49),
		A3($author$project$Emoji$EmojiData, 'nazar amulet', 51, 50),
		A3($author$project$Emoji$EmojiData, 'ballet shoes', 51, 51),
		A3($author$project$Emoji$EmojiData, 'one piece swimsuit', 51, 52),
		A3($author$project$Emoji$EmojiData, 'briefs', 51, 53),
		A3($author$project$Emoji$EmojiData, 'shorts', 51, 54),
		A3($author$project$Emoji$EmojiData, 'drop of blood', 51, 55),
		A3($author$project$Emoji$EmojiData, 'adhesive bandage', 51, 56),
		A3($author$project$Emoji$EmojiData, 'stethoscope', 52, 0),
		A3($author$project$Emoji$EmojiData, 'yo yo', 52, 1),
		A3($author$project$Emoji$EmojiData, 'kite', 52, 2),
		A3($author$project$Emoji$EmojiData, 'parachute', 52, 3),
		A3($author$project$Emoji$EmojiData, 'ringed planet', 52, 4),
		A3($author$project$Emoji$EmojiData, 'chair', 52, 5),
		A3($author$project$Emoji$EmojiData, 'razor', 52, 6),
		A3($author$project$Emoji$EmojiData, 'axe', 52, 7),
		A3($author$project$Emoji$EmojiData, 'diya lamp', 52, 8),
		A3($author$project$Emoji$EmojiData, 'banjo', 52, 9),
		A3($author$project$Emoji$EmojiData, 'bangbang', 52, 10),
		A3($author$project$Emoji$EmojiData, 'interrobang', 52, 11),
		A3($author$project$Emoji$EmojiData, 'tm', 52, 12),
		A3($author$project$Emoji$EmojiData, 'information source', 52, 13),
		A3($author$project$Emoji$EmojiData, 'left right arrow', 52, 14),
		A3($author$project$Emoji$EmojiData, 'arrow up down', 52, 15),
		A3($author$project$Emoji$EmojiData, 'arrow upper left', 52, 16),
		A3($author$project$Emoji$EmojiData, 'arrow upper right', 52, 17),
		A3($author$project$Emoji$EmojiData, 'arrow lower right', 52, 18),
		A3($author$project$Emoji$EmojiData, 'arrow lower left', 52, 19),
		A3($author$project$Emoji$EmojiData, 'leftwards arrow with hook', 52, 20),
		A3($author$project$Emoji$EmojiData, 'arrow right hook', 52, 21),
		A3($author$project$Emoji$EmojiData, 'watch', 52, 22),
		A3($author$project$Emoji$EmojiData, 'hourglass', 52, 23),
		A3($author$project$Emoji$EmojiData, 'keyboard', 52, 24),
		A3($author$project$Emoji$EmojiData, 'eject', 52, 25),
		A3($author$project$Emoji$EmojiData, 'fast forward', 52, 26),
		A3($author$project$Emoji$EmojiData, 'rewind', 52, 27),
		A3($author$project$Emoji$EmojiData, 'arrow double up', 52, 28),
		A3($author$project$Emoji$EmojiData, 'arrow double down', 52, 29),
		A3($author$project$Emoji$EmojiData, 'black right pointing double triangle with vertical bar', 52, 30),
		A3($author$project$Emoji$EmojiData, 'black left pointing double triangle with vertical bar', 52, 31),
		A3($author$project$Emoji$EmojiData, 'black right pointing triangle with double vertical bar', 52, 32),
		A3($author$project$Emoji$EmojiData, 'alarm clock', 52, 33),
		A3($author$project$Emoji$EmojiData, 'stopwatch', 52, 34),
		A3($author$project$Emoji$EmojiData, 'timer clock', 52, 35),
		A3($author$project$Emoji$EmojiData, 'hourglass flowing sand', 52, 36),
		A3($author$project$Emoji$EmojiData, 'double vertical bar', 52, 37),
		A3($author$project$Emoji$EmojiData, 'black square for stop', 52, 38),
		A3($author$project$Emoji$EmojiData, 'black circle for record', 52, 39),
		A3($author$project$Emoji$EmojiData, 'm', 52, 40),
		A3($author$project$Emoji$EmojiData, 'black small square', 52, 41),
		A3($author$project$Emoji$EmojiData, 'white small square', 52, 42),
		A3($author$project$Emoji$EmojiData, 'arrow forward', 52, 43),
		A3($author$project$Emoji$EmojiData, 'arrow backward', 52, 44),
		A3($author$project$Emoji$EmojiData, 'white medium square', 52, 45),
		A3($author$project$Emoji$EmojiData, 'black medium square', 52, 46),
		A3($author$project$Emoji$EmojiData, 'white medium small square', 52, 47),
		A3($author$project$Emoji$EmojiData, 'black medium small square', 52, 48),
		A3($author$project$Emoji$EmojiData, 'sunny', 52, 49),
		A3($author$project$Emoji$EmojiData, 'cloud', 52, 50),
		A3($author$project$Emoji$EmojiData, 'umbrella', 52, 51),
		A3($author$project$Emoji$EmojiData, 'snowman', 52, 52),
		A3($author$project$Emoji$EmojiData, 'comet', 52, 53),
		A3($author$project$Emoji$EmojiData, 'phone', 52, 54),
		A3($author$project$Emoji$EmojiData, 'ballot box with check', 52, 55),
		A3($author$project$Emoji$EmojiData, 'umbrella with rain drops', 52, 56),
		A3($author$project$Emoji$EmojiData, 'coffee', 53, 0),
		A3($author$project$Emoji$EmojiData, 'shamrock', 53, 1),
		A3($author$project$Emoji$EmojiData, 'point up', 53, 2),
		A3($author$project$Emoji$EmojiData, 'skull and crossbones', 53, 8),
		A3($author$project$Emoji$EmojiData, 'radioactive sign', 53, 9),
		A3($author$project$Emoji$EmojiData, 'biohazard sign', 53, 10),
		A3($author$project$Emoji$EmojiData, 'orthodox cross', 53, 11),
		A3($author$project$Emoji$EmojiData, 'star and crescent', 53, 12),
		A3($author$project$Emoji$EmojiData, 'peace symbol', 53, 13),
		A3($author$project$Emoji$EmojiData, 'yin yang', 53, 14),
		A3($author$project$Emoji$EmojiData, 'wheel of dharma', 53, 15),
		A3($author$project$Emoji$EmojiData, 'white frowning face', 53, 16),
		A3($author$project$Emoji$EmojiData, 'relaxed', 53, 17),
		A3($author$project$Emoji$EmojiData, 'female sign', 53, 18),
		A3($author$project$Emoji$EmojiData, 'male sign', 53, 19),
		A3($author$project$Emoji$EmojiData, 'aries', 53, 20),
		A3($author$project$Emoji$EmojiData, 'taurus', 53, 21),
		A3($author$project$Emoji$EmojiData, 'gemini', 53, 22),
		A3($author$project$Emoji$EmojiData, 'cancer', 53, 23),
		A3($author$project$Emoji$EmojiData, 'leo', 53, 24),
		A3($author$project$Emoji$EmojiData, 'virgo', 53, 25),
		A3($author$project$Emoji$EmojiData, 'libra', 53, 26),
		A3($author$project$Emoji$EmojiData, 'scorpius', 53, 27),
		A3($author$project$Emoji$EmojiData, 'sagittarius', 53, 28),
		A3($author$project$Emoji$EmojiData, 'capricorn', 53, 29),
		A3($author$project$Emoji$EmojiData, 'aquarius', 53, 30),
		A3($author$project$Emoji$EmojiData, 'pisces', 53, 31),
		A3($author$project$Emoji$EmojiData, 'chess pawn', 53, 32),
		A3($author$project$Emoji$EmojiData, 'spades', 53, 33),
		A3($author$project$Emoji$EmojiData, 'clubs', 53, 34),
		A3($author$project$Emoji$EmojiData, 'hearts', 53, 35),
		A3($author$project$Emoji$EmojiData, 'diamonds', 53, 36),
		A3($author$project$Emoji$EmojiData, 'hotsprings', 53, 37),
		A3($author$project$Emoji$EmojiData, 'recycle', 53, 38),
		A3($author$project$Emoji$EmojiData, 'infinity', 53, 39),
		A3($author$project$Emoji$EmojiData, 'wheelchair', 53, 40),
		A3($author$project$Emoji$EmojiData, 'hammer and pick', 53, 41),
		A3($author$project$Emoji$EmojiData, 'anchor', 53, 42),
		A3($author$project$Emoji$EmojiData, 'crossed swords', 53, 43),
		A3($author$project$Emoji$EmojiData, 'medical symbol', 53, 44),
		A3($author$project$Emoji$EmojiData, 'scales', 53, 45),
		A3($author$project$Emoji$EmojiData, 'alembic', 53, 46),
		A3($author$project$Emoji$EmojiData, 'gear', 53, 47),
		A3($author$project$Emoji$EmojiData, 'atom symbol', 53, 48),
		A3($author$project$Emoji$EmojiData, 'fleur de lis', 53, 49),
		A3($author$project$Emoji$EmojiData, 'warning', 53, 50),
		A3($author$project$Emoji$EmojiData, 'zap', 53, 51),
		A3($author$project$Emoji$EmojiData, 'white circle', 53, 52),
		A3($author$project$Emoji$EmojiData, 'black circle', 53, 53),
		A3($author$project$Emoji$EmojiData, 'coffin', 53, 54),
		A3($author$project$Emoji$EmojiData, 'funeral urn', 53, 55),
		A3($author$project$Emoji$EmojiData, 'soccer', 53, 56),
		A3($author$project$Emoji$EmojiData, 'baseball', 54, 0),
		A3($author$project$Emoji$EmojiData, 'snowman without snow', 54, 1),
		A3($author$project$Emoji$EmojiData, 'partly sunny', 54, 2),
		A3($author$project$Emoji$EmojiData, 'thunder cloud and rain', 54, 3),
		A3($author$project$Emoji$EmojiData, 'ophiuchus', 54, 4),
		A3($author$project$Emoji$EmojiData, 'pick', 54, 5),
		A3($author$project$Emoji$EmojiData, 'helmet with white cross', 54, 6),
		A3($author$project$Emoji$EmojiData, 'chains', 54, 7),
		A3($author$project$Emoji$EmojiData, 'no entry', 54, 8),
		A3($author$project$Emoji$EmojiData, 'shinto shrine', 54, 9),
		A3($author$project$Emoji$EmojiData, 'church', 54, 10),
		A3($author$project$Emoji$EmojiData, 'mountain', 54, 11),
		A3($author$project$Emoji$EmojiData, 'umbrella on ground', 54, 12),
		A3($author$project$Emoji$EmojiData, 'fountain', 54, 13),
		A3($author$project$Emoji$EmojiData, 'golf', 54, 14),
		A3($author$project$Emoji$EmojiData, 'ferry', 54, 15),
		A3($author$project$Emoji$EmojiData, 'boat', 54, 16),
		A3($author$project$Emoji$EmojiData, 'skier', 54, 17),
		A3($author$project$Emoji$EmojiData, 'ice skate', 54, 18),
		A3($author$project$Emoji$EmojiData, 'woman bouncing ball', 54, 19),
		A3($author$project$Emoji$EmojiData, 'man bouncing ball', 54, 25),
		A3($author$project$Emoji$EmojiData, 'person with ball', 54, 31),
		A3($author$project$Emoji$EmojiData, 'tent', 54, 37),
		A3($author$project$Emoji$EmojiData, 'fuelpump', 54, 38),
		A3($author$project$Emoji$EmojiData, 'scissors', 54, 39),
		A3($author$project$Emoji$EmojiData, 'white check mark', 54, 40),
		A3($author$project$Emoji$EmojiData, 'airplane', 54, 41),
		A3($author$project$Emoji$EmojiData, 'email', 54, 42),
		A3($author$project$Emoji$EmojiData, 'fist', 54, 43),
		A3($author$project$Emoji$EmojiData, 'hand', 54, 49),
		A3($author$project$Emoji$EmojiData, 'v', 54, 55),
		A3($author$project$Emoji$EmojiData, 'writing hand', 55, 4),
		A3($author$project$Emoji$EmojiData, 'pencil2', 55, 10),
		A3($author$project$Emoji$EmojiData, 'black nib', 55, 11),
		A3($author$project$Emoji$EmojiData, 'heavy check mark', 55, 12),
		A3($author$project$Emoji$EmojiData, 'heavy multiplication x', 55, 13),
		A3($author$project$Emoji$EmojiData, 'latin cross', 55, 14),
		A3($author$project$Emoji$EmojiData, 'star of david', 55, 15),
		A3($author$project$Emoji$EmojiData, 'sparkles', 55, 16),
		A3($author$project$Emoji$EmojiData, 'eight spoked asterisk', 55, 17),
		A3($author$project$Emoji$EmojiData, 'eight pointed black star', 55, 18),
		A3($author$project$Emoji$EmojiData, 'snowflake', 55, 19),
		A3($author$project$Emoji$EmojiData, 'sparkle', 55, 20),
		A3($author$project$Emoji$EmojiData, 'x', 55, 21),
		A3($author$project$Emoji$EmojiData, 'negative squared cross mark', 55, 22),
		A3($author$project$Emoji$EmojiData, 'question', 55, 23),
		A3($author$project$Emoji$EmojiData, 'grey question', 55, 24),
		A3($author$project$Emoji$EmojiData, 'grey exclamation', 55, 25),
		A3($author$project$Emoji$EmojiData, 'exclamation', 55, 26),
		A3($author$project$Emoji$EmojiData, 'heavy heart exclamation mark ornament', 55, 27),
		A3($author$project$Emoji$EmojiData, 'heart', 55, 28),
		A3($author$project$Emoji$EmojiData, 'heavy plus sign', 55, 29),
		A3($author$project$Emoji$EmojiData, 'heavy minus sign', 55, 30),
		A3($author$project$Emoji$EmojiData, 'heavy division sign', 55, 31),
		A3($author$project$Emoji$EmojiData, 'arrow right', 55, 32),
		A3($author$project$Emoji$EmojiData, 'curly loop', 55, 33),
		A3($author$project$Emoji$EmojiData, 'loop', 55, 34),
		A3($author$project$Emoji$EmojiData, 'arrow heading up', 55, 35),
		A3($author$project$Emoji$EmojiData, 'arrow heading down', 55, 36),
		A3($author$project$Emoji$EmojiData, 'arrow left', 55, 37),
		A3($author$project$Emoji$EmojiData, 'arrow up', 55, 38),
		A3($author$project$Emoji$EmojiData, 'arrow down', 55, 39),
		A3($author$project$Emoji$EmojiData, 'black large square', 55, 40),
		A3($author$project$Emoji$EmojiData, 'white large square', 55, 41),
		A3($author$project$Emoji$EmojiData, 'star', 55, 42),
		A3($author$project$Emoji$EmojiData, 'o', 55, 43),
		A3($author$project$Emoji$EmojiData, 'wavy dash', 55, 44),
		A3($author$project$Emoji$EmojiData, 'part alternation mark', 55, 45),
		A3($author$project$Emoji$EmojiData, 'congratulations', 55, 46),
		A3($author$project$Emoji$EmojiData, 'secret', 55, 47)
	]);
var $author$project$Emoji$recommended = _List_fromArray(
	[
		A3($author$project$Emoji$EmojiData, 'smiley', 30, 38),
		A3($author$project$Emoji$EmojiData, 'sweat smile', 30, 40),
		A3($author$project$Emoji$EmojiData, 'relieved', 30, 47),
		A3($author$project$Emoji$EmojiData, 'disappointed', 31, 8),
		A3($author$project$Emoji$EmojiData, 'worried', 31, 9),
		A3($author$project$Emoji$EmojiData, 'tired face', 31, 21),
		A3($author$project$Emoji$EmojiData, 'grimacing', 31, 22),
		A3($author$project$Emoji$EmojiData, 'dizzy face', 31, 31),
		A3($author$project$Emoji$EmojiData, 'mask', 31, 33),
		A3($author$project$Emoji$EmojiData, 'face with head bandage', 37, 28)
	]);
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Emoji$filter = function (name) {
	return $elm$core$String$isEmpty(name) ? $author$project$Emoji$recommended : A2(
		$elm$core$List$sortBy,
		function (e) {
			return $elm$core$String$length(e.aa);
		},
		A2(
			$elm$core$List$filter,
			function (emojiData) {
				return A2($elm$core$String$contains, name, emojiData.aa);
			},
			$author$project$Emoji$list));
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Emoji$view = function (_v0) {
	var name = _v0.aa;
	var x = _v0.a1;
	var y = _v0.a2;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('emoji'),
				A2(
				$elm$html$Html$Attributes$style,
				'background-position',
				$elm$core$String$concat(
					_List_fromArray(
						[
							$elm$core$String$fromInt(x * (-22)),
							'px ',
							$elm$core$String$fromInt(y * (-22)),
							'px'
						])))
			]),
		_List_Nil);
};
var $author$project$ActivityForm$emojiSelect = F2(
	function (msg, emoji) {
		var padding = A2($elm$html$Html$Attributes$style, 'padding', '3.5px 0.5rem 0.5px 0.5rem');
		var emojis = A2(
			$elm$core$List$take,
			10,
			$author$project$Emoji$filter(
				$elm$core$String$toLower(emoji)));
		var emojiItem = function (data) {
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						msg(data.aa)),
						A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
						padding,
						A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
					]),
				_List_fromArray(
					[
						$author$project$Emoji$view(data),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
								A2($elm$html$Html$Attributes$style, 'vertical-align', 'top'),
								A2($elm$html$Html$Attributes$style, 'margin-left', '0.5rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(data.aa)
							]))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('button'),
											padding,
											A2($elm$html$Html$Attributes$style, 'border-top-right-radius', '0'),
											A2($elm$html$Html$Attributes$style, 'border-bottom-right-radius', '0')
										]),
									_List_fromArray(
										[
											$author$project$Emoji$view(
											A2(
												$elm$core$Maybe$withDefault,
												$author$project$Emoji$default,
												$elm$core$List$head(emojis)))
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Events$onInput(msg),
											$elm$html$Html$Events$onFocus(
											msg('')),
											$elm$html$Html$Attributes$class('input small icon'),
											A2($elm$html$Html$Attributes$style, 'width', '6rem'),
											$elm$html$Html$Attributes$value(emoji)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							A2($elm$core$List$map, emojiItem, emojis))
						]))
				]));
	});
var $justinmimbs$date$Date$day = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.ao;
	});
var $justinmimbs$date$Date$monthNumber = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToNumber);
var $justinmimbs$date$Date$ordinalDay = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toOrdinalDate,
	function ($) {
		return $.ac;
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $justinmimbs$date$Date$padSignedInt = F2(
	function (length, _int) {
		return _Utils_ap(
			(_int < 0) ? '-' : '',
			A3(
				$elm$core$String$padLeft,
				length,
				'0',
				$elm$core$String$fromInt(
					$elm$core$Basics$abs(_int))));
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $justinmimbs$date$Date$numberToWeekday = function (wdn) {
	var _v0 = A2($elm$core$Basics$max, 1, wdn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 6;
	}
};
var $justinmimbs$date$Date$toWeekDate = function (_v0) {
	var rd = _v0;
	var wdn = $justinmimbs$date$Date$weekdayNumber(rd);
	var wy = $justinmimbs$date$Date$year(rd + (4 - wdn));
	var week1Day1 = $justinmimbs$date$Date$daysBeforeWeekYear(wy) + 1;
	return {
		a$: 1 + (((rd - week1Day1) / 7) | 0),
		a0: wy,
		bG: $justinmimbs$date$Date$numberToWeekday(wdn)
	};
};
var $justinmimbs$date$Date$weekNumber = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.a$;
	});
var $justinmimbs$date$Date$weekYear = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.a0;
	});
var $justinmimbs$date$Date$weekday = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$weekdayNumber, $justinmimbs$date$Date$numberToWeekday);
var $justinmimbs$date$Date$ordinalSuffix = function (n) {
	var nn = A2($elm$core$Basics$modBy, 100, n);
	var _v0 = A2(
		$elm$core$Basics$min,
		(nn < 20) ? nn : A2($elm$core$Basics$modBy, 10, nn),
		4);
	switch (_v0) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};
var $justinmimbs$date$Date$withOrdinalSuffix = function (n) {
	return _Utils_ap(
		$elm$core$String$fromInt(n),
		$justinmimbs$date$Date$ordinalSuffix(n));
};
var $justinmimbs$date$Date$formatField = F4(
	function (language, _char, length, date) {
		switch (_char) {
			case 'y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$year(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$year(date));
				}
			case 'Y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekYear(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$weekYear(date));
				}
			case 'Q':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 3:
						return 'Q' + $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 4:
						return $justinmimbs$date$Date$withOrdinalSuffix(
							$justinmimbs$date$Date$quarter(date));
					case 5:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					default:
						return '';
				}
			case 'M':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$monthNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$monthNumber(date)));
					case 3:
						return language.R(
							$justinmimbs$date$Date$month(date));
					case 4:
						return language._(
							$justinmimbs$date$Date$month(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.R(
								$justinmimbs$date$Date$month(date)));
					default:
						return '';
				}
			case 'w':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekNumber(date)));
					default:
						return '';
				}
			case 'd':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$day(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$day(date)));
					case 3:
						return language.U(
							$justinmimbs$date$Date$day(date));
					default:
						return '';
				}
			case 'D':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$ordinalDay(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					case 3:
						return A3(
							$elm$core$String$padLeft,
							3,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					default:
						return '';
				}
			case 'E':
				switch (length) {
					case 1:
						return language.D(
							$justinmimbs$date$Date$weekday(date));
					case 2:
						return language.D(
							$justinmimbs$date$Date$weekday(date));
					case 3:
						return language.D(
							$justinmimbs$date$Date$weekday(date));
					case 4:
						return language.ah(
							$justinmimbs$date$Date$weekday(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.D(
								$justinmimbs$date$Date$weekday(date)));
					case 6:
						return A2(
							$elm$core$String$left,
							2,
							language.D(
								$justinmimbs$date$Date$weekday(date)));
					default:
						return '';
				}
			case 'e':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					default:
						return A4($justinmimbs$date$Date$formatField, language, 'E', length, date);
				}
			default:
				return '';
		}
	});
var $justinmimbs$date$Date$formatWithTokens = F3(
	function (language, tokens, date) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (token, formatted) {
					if (!token.$) {
						var _char = token.a;
						var length = token.b;
						return _Utils_ap(
							A4($justinmimbs$date$Date$formatField, language, _char, length, date),
							formatted);
					} else {
						var str = token.a;
						return _Utils_ap(str, formatted);
					}
				}),
			'',
			tokens);
	});
var $justinmimbs$date$Pattern$Literal = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$date$Pattern$escapedQuote = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$justinmimbs$date$Pattern$Literal('\'')),
	$elm$parser$Parser$token('\'\''));
var $justinmimbs$date$Pattern$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{am: col, c: s0.c, d: s0.d, b: offset, aS: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.aS, s.am, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.b, s);
};
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $justinmimbs$date$Pattern$fieldRepeats = function (str) {
	var _v0 = $elm$core$String$toList(str);
	if (_v0.b && (!_v0.b.b)) {
		var _char = _v0.a;
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (x, y) {
							return A2($justinmimbs$date$Pattern$Field, _char, 1 + (y - x));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getOffset,
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(_char)))),
			$elm$parser$Parser$getOffset);
	} else {
		return $elm$parser$Parser$problem('expected exactly one char');
	}
};
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $justinmimbs$date$Pattern$field = A2(
	$elm$parser$Parser$andThen,
	$justinmimbs$date$Pattern$fieldRepeats,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf($elm$core$Char$isAlpha)));
var $justinmimbs$date$Pattern$finalize = A2(
	$elm$core$List$foldl,
	F2(
		function (token, tokens) {
			var _v0 = _Utils_Tuple2(token, tokens);
			if (((_v0.a.$ === 1) && _v0.b.b) && (_v0.b.a.$ === 1)) {
				var x = _v0.a.a;
				var _v1 = _v0.b;
				var y = _v1.a.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					$justinmimbs$date$Pattern$Literal(
						_Utils_ap(x, y)),
					rest);
			} else {
				return A2($elm$core$List$cons, token, tokens);
			}
		}),
	_List_Nil);
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $justinmimbs$date$Pattern$isLiteralChar = function (_char) {
	return (_char !== '\'') && (!$elm$core$Char$isAlpha(_char));
};
var $justinmimbs$date$Pattern$literal = A2(
	$elm$parser$Parser$map,
	$justinmimbs$date$Pattern$Literal,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($justinmimbs$date$Pattern$isLiteralChar)),
			$elm$parser$Parser$chompWhile($justinmimbs$date$Pattern$isLiteralChar))));
var $justinmimbs$date$Pattern$quotedHelp = function (result) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (str) {
					return $justinmimbs$date$Pattern$quotedHelp(
						_Utils_ap(result, str));
				},
				$elm$parser$Parser$getChompedString(
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(0),
							$elm$parser$Parser$chompIf(
								$elm$core$Basics$neq('\''))),
						$elm$parser$Parser$chompWhile(
							$elm$core$Basics$neq('\''))))),
				A2(
				$elm$parser$Parser$andThen,
				function (_v0) {
					return $justinmimbs$date$Pattern$quotedHelp(result + '\'');
				},
				$elm$parser$Parser$token('\'\'')),
				$elm$parser$Parser$succeed(result)
			]));
};
var $justinmimbs$date$Pattern$quoted = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($justinmimbs$date$Pattern$Literal),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('\''))),
	A2(
		$elm$parser$Parser$ignorer,
		$justinmimbs$date$Pattern$quotedHelp(''),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('\'')),
					$elm$parser$Parser$end
				]))));
var $justinmimbs$date$Pattern$patternHelp = function (tokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (token) {
					return $justinmimbs$date$Pattern$patternHelp(
						A2($elm$core$List$cons, token, tokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$justinmimbs$date$Pattern$field, $justinmimbs$date$Pattern$literal, $justinmimbs$date$Pattern$escapedQuote, $justinmimbs$date$Pattern$quoted]))),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $elm$parser$Parser$succeed(
						$justinmimbs$date$Pattern$finalize(tokens));
				})
			]));
};
var $justinmimbs$date$Pattern$fromString = function (str) {
	return A2(
		$elm$core$Result$withDefault,
		_List_fromArray(
			[
				$justinmimbs$date$Pattern$Literal(str)
			]),
		A2(
			$elm$parser$Parser$run,
			$justinmimbs$date$Pattern$patternHelp(_List_Nil),
			str));
};
var $justinmimbs$date$Date$formatWithLanguage = F2(
	function (language, pattern) {
		var tokens = $elm$core$List$reverse(
			$justinmimbs$date$Pattern$fromString(pattern));
		return A2($justinmimbs$date$Date$formatWithTokens, language, tokens);
	});
var $justinmimbs$date$Date$monthToName = function (m) {
	switch (m) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $justinmimbs$date$Date$weekdayToName = function (wd) {
	switch (wd) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $justinmimbs$date$Date$language_en = {
	U: $justinmimbs$date$Date$withOrdinalSuffix,
	_: $justinmimbs$date$Date$monthToName,
	R: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$monthToName,
		$elm$core$String$left(3)),
	ah: $justinmimbs$date$Date$weekdayToName,
	D: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$weekdayToName,
		$elm$core$String$left(3))
};
var $justinmimbs$date$Date$format = function (pattern) {
	return A2($justinmimbs$date$Date$formatWithLanguage, $justinmimbs$date$Date$language_en, pattern);
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$MPRLevel$stripTimeStr = function (str) {
	var _v0 = $author$project$MPRLevel$timeStrToHrsMinsSecs(str);
	if ((((_v0.b && (!_v0.a)) && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
		var _v1 = _v0.b;
		var min = _v1.a;
		var _v2 = _v1.b;
		var sec = _v2.a;
		return $elm$core$String$fromInt(min) + (':' + function () {
			var _v3 = A2($elm$core$Basics$compare, sec, 10);
			if (!_v3) {
				return '0' + $elm$core$String$fromInt(sec);
			} else {
				return $elm$core$String$fromInt(sec);
			}
		}());
	} else {
		return str;
	}
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$MPRLevel$paceList = _List_fromArray(
	['Easy', 'Moderate', 'Steady State', 'Brisk', 'Aerobic Threshold', 'Lactate Threshold', 'Groove', 'VO2 Max', 'Fast']);
var $author$project$MPRData$aerobicTraining = '\n[[["0:11:12","0:12:19"],["0:10:49","0:10:55"],["0:10:27","0:10:32"],["0:10:04","0:10:10"],["0:09:42","0:09:47"],["0:09:20","0:09:25"],["0:08:57","0:09:02"],["0:08:35","0:08:39"],["0:08:13","0:08:17"]],[["0:11:06","0:12:12"],["0:10:44","0:10:49"],["0:10:21","0:10:27"],["0:09:59","0:10:04"],["0:09:37","0:09:42"],["0:09:15","0:09:20"],["0:08:53","0:08:57"],["0:08:30","0:08:35"],["0:08:08","0:08:13"]],[["0:11:00","0:12:06"],["0:10:38","0:10:44"],["0:10:16","0:10:21"],["0:09:54","0:09:59"],["0:09:32","0:09:37"],["0:09:10","0:09:15"],["0:08:48","0:08:53"],["0:08:26","0:08:30"],["0:08:04","0:08:08"]],[["0:10:54","0:11:59"],["0:10:32","0:10:38"],["0:10:10","0:10:16"],["0:09:49","0:09:54"],["0:09:27","0:09:32"],["0:09:05","0:09:10"],["0:08:43","0:08:48"],["0:08:21","0:08:26"],["0:08:00","0:08:04"]],[["0:10:48","0:11:53"],["0:10:27","0:10:32"],["0:10:05","0:10:10"],["0:09:43","0:09:49"],["0:09:22","0:09:27"],["0:09:00","0:09:05"],["0:08:39","0:08:43"],["0:08:17","0:08:21"],["0:07:55","0:08:00"]],[["0:10:42","0:11:47"],["0:10:21","0:10:27"],["0:10:00","0:10:05"],["0:09:38","0:09:43"],["0:09:17","0:09:22"],["0:08:55","0:09:00"],["0:08:34","0:08:39"],["0:08:12","0:08:17"],["0:07:51","0:07:55"]],[["0:10:37","0:11:40"],["0:10:15","0:10:21"],["0:09:54","0:10:00"],["0:09:33","0:09:38"],["0:09:12","0:09:17"],["0:08:50","0:08:55"],["0:08:29","0:08:34"],["0:08:08","0:08:12"],["0:07:47","0:07:51"]],[["0:10:31","0:11:34"],["0:10:10","0:10:15"],["0:09:49","0:09:54"],["0:09:28","0:09:33"],["0:09:07","0:09:12"],["0:08:46","0:08:50"],["0:08:25","0:08:29"],["0:08:03","0:08:08"],["0:07:42","0:07:47"]],[["0:10:25","0:11:27"],["0:10:04","0:10:10"],["0:09:43","0:09:49"],["0:09:22","0:09:28"],["0:09:01","0:09:07"],["0:08:41","0:08:46"],["0:08:20","0:08:25"],["0:07:59","0:08:03"],["0:07:38","0:07:42"]],[["0:10:19","0:11:21"],["0:09:58","0:10:04"],["0:09:38","0:09:43"],["0:09:17","0:09:22"],["0:08:56","0:09:01"],["0:08:36","0:08:41"],["0:08:15","0:08:20"],["0:07:55","0:07:59"],["0:07:34","0:07:38"]],[["0:10:13","0:11:14"],["0:09:53","0:09:58"],["0:09:32","0:09:38"],["0:09:12","0:09:17"],["0:08:51","0:08:56"],["0:08:31","0:08:36"],["0:08:10","0:08:15"],["0:07:50","0:07:55"],["0:07:30","0:07:34"]],[["0:10:07","0:11:08"],["0:09:47","0:09:53"],["0:09:27","0:09:32"],["0:09:07","0:09:12"],["0:08:46","0:08:51"],["0:08:26","0:08:31"],["0:08:06","0:08:10"],["0:07:46","0:07:50"],["0:07:25","0:07:30"]],[["0:10:01","0:11:02"],["0:09:41","0:09:47"],["0:09:21","0:09:27"],["0:09:01","0:09:07"],["0:08:41","0:08:46"],["0:08:21","0:08:26"],["0:08:01","0:08:06"],["0:07:41","0:07:46"],["0:07:21","0:07:25"]],[["0:09:56","0:10:55"],["0:09:36","0:09:41"],["0:09:16","0:09:21"],["0:08:56","0:09:01"],["0:08:36","0:08:41"],["0:08:16","0:08:21"],["0:07:56","0:08:01"],["0:07:37","0:07:41"],["0:07:17","0:07:21"]],[["0:09:50","0:10:49"],["0:09:30","0:09:36"],["0:09:10","0:09:16"],["0:08:51","0:08:56"],["0:08:31","0:08:36"],["0:08:11","0:08:16"],["0:07:52","0:07:56"],["0:07:32","0:07:37"],["0:07:12","0:07:17"]],[["0:09:44","0:10:42"],["0:09:24","0:09:30"],["0:09:05","0:09:10"],["0:08:45","0:08:51"],["0:08:26","0:08:31"],["0:08:07","0:08:11"],["0:07:47","0:07:52"],["0:07:28","0:07:32"],["0:07:08","0:07:12"]],[["0:09:38","0:10:36"],["0:09:19","0:09:24"],["0:08:59","0:09:05"],["0:08:40","0:08:45"],["0:08:21","0:08:26"],["0:08:02","0:08:07"],["0:07:42","0:07:47"],["0:07:23","0:07:28"],["0:07:04","0:07:08"]],[["0:09:32","0:10:29"],["0:09:13","0:09:19"],["0:08:54","0:08:59"],["0:08:35","0:08:40"],["0:08:16","0:08:21"],["0:07:57","0:08:02"],["0:07:38","0:07:42"],["0:07:19","0:07:23"],["0:07:00","0:07:04"]],[["0:09:26","0:10:23"],["0:09:07","0:09:13"],["0:08:48","0:08:54"],["0:08:30","0:08:35"],["0:08:11","0:08:16"],["0:07:52","0:07:57"],["0:07:33","0:07:38"],["0:07:14","0:07:19"],["0:06:55","0:07:00"]],[["0:09:20","0:10:16"],["0:09:02","0:09:07"],["0:08:43","0:08:48"],["0:08:24","0:08:30"],["0:08:06","0:08:11"],["0:07:47","0:07:52"],["0:07:28","0:07:33"],["0:07:10","0:07:14"],["0:06:51","0:06:55"]],[["0:09:15","0:10:10"],["0:08:56","0:09:02"],["0:08:38","0:08:43"],["0:08:19","0:08:24"],["0:08:01","0:08:06"],["0:07:42","0:07:47"],["0:07:24","0:07:28"],["0:07:05","0:07:10"],["0:06:47","0:06:51"]],[["0:09:09","0:10:04"],["0:08:50","0:08:56"],["0:08:32","0:08:38"],["0:08:14","0:08:19"],["0:07:56","0:08:01"],["0:07:37","0:07:42"],["0:07:19","0:07:24"],["0:07:01","0:07:05"],["0:06:42","0:06:47"]],[["0:09:03","0:09:57"],["0:08:45","0:08:50"],["0:08:27","0:08:32"],["0:08:09","0:08:14"],["0:07:50","0:07:56"],["0:07:32","0:07:37"],["0:07:14","0:07:19"],["0:06:56","0:07:01"],["0:06:38","0:06:42"]],[["0:08:57","0:09:51"],["0:08:39","0:08:45"],["0:08:21","0:08:27"],["0:08:03","0:08:09"],["0:07:45","0:07:50"],["0:07:27","0:07:32"],["0:07:10","0:07:14"],["0:06:52","0:06:56"],["0:06:34","0:06:38"]],[["0:08:51","0:09:44"],["0:08:33","0:08:39"],["0:08:16","0:08:21"],["0:07:58","0:08:03"],["0:07:40","0:07:45"],["0:07:23","0:07:27"],["0:07:05","0:07:10"],["0:06:47","0:06:52"],["0:06:29","0:06:34"]],[["0:08:45","0:09:38"],["0:08:28","0:08:33"],["0:08:10","0:08:16"],["0:07:53","0:07:58"],["0:07:35","0:07:40"],["0:07:18","0:07:23"],["0:07:00","0:07:05"],["0:06:43","0:06:47"],["0:06:25","0:06:29"]],[["0:08:39","0:09:31"],["0:08:22","0:08:28"],["0:08:05","0:08:10"],["0:07:47","0:07:53"],["0:07:30","0:07:35"],["0:07:13","0:07:18"],["0:06:56","0:07:00"],["0:06:38","0:06:43"],["0:06:21","0:06:25"]],[["0:08:34","0:09:25"],["0:08:16","0:08:22"],["0:07:59","0:08:05"],["0:07:42","0:07:47"],["0:07:25","0:07:30"],["0:07:08","0:07:13"],["0:06:51","0:06:56"],["0:06:34","0:06:38"],["0:06:17","0:06:21"]],[["0:08:28","0:09:18"],["0:08:11","0:08:16"],["0:07:54","0:07:59"],["0:07:37","0:07:42"],["0:07:20","0:07:25"],["0:07:03","0:07:08"],["0:06:46","0:06:51"],["0:06:29","0:06:34"],["0:06:12","0:06:17"]],[["0:08:22","0:09:12"],["0:08:05","0:08:11"],["0:07:48","0:07:54"],["0:07:32","0:07:37"],["0:07:15","0:07:20"],["0:06:58","0:07:03"],["0:06:41","0:06:46"],["0:06:25","0:06:29"],["0:06:08","0:06:12"]],[["0:08:16","0:09:06"],["0:07:59","0:08:05"],["0:07:43","0:07:48"],["0:07:26","0:07:32"],["0:07:10","0:07:15"],["0:06:53","0:06:58"],["0:06:37","0:06:41"],["0:06:20","0:06:25"],["0:06:04","0:06:08"]],[["0:08:10","0:08:59"],["0:07:54","0:07:59"],["0:07:37","0:07:43"],["0:07:21","0:07:26"],["0:07:05","0:07:10"],["0:06:48","0:06:53"],["0:06:32","0:06:37"],["0:06:16","0:06:20"],["0:05:59","0:06:04"]],[["0:08:04","0:08:53"],["0:07:48","0:07:54"],["0:07:32","0:07:37"],["0:07:16","0:07:21"],["0:07:00","0:07:05"],["0:06:44","0:06:48"],["0:06:27","0:06:32"],["0:06:11","0:06:16"],["0:05:55","0:05:59"]],[["0:07:58","0:08:46"],["0:07:42","0:07:48"],["0:07:26","0:07:32"],["0:07:11","0:07:16"],["0:06:55","0:07:00"],["0:06:39","0:06:44"],["0:06:23","0:06:27"],["0:06:07","0:06:11"],["0:05:51","0:05:55"]],[["0:07:53","0:08:40"],["0:07:37","0:07:42"],["0:07:21","0:07:26"],["0:07:05","0:07:11"],["0:06:50","0:06:55"],["0:06:34","0:06:39"],["0:06:18","0:06:23"],["0:06:02","0:06:07"],["0:05:47","0:05:51"]],[["0:07:47","0:08:33"],["0:07:31","0:07:37"],["0:07:16","0:07:21"],["0:07:00","0:07:05"],["0:06:44","0:06:50"],["0:06:29","0:06:34"],["0:06:13","0:06:18"],["0:05:58","0:06:02"],["0:05:42","0:05:47"]],[["0:07:41","0:08:27"],["0:07:25","0:07:31"],["0:07:10","0:07:16"],["0:06:55","0:07:00"],["0:06:39","0:06:44"],["0:06:24","0:06:29"],["0:06:09","0:06:13"],["0:05:53","0:05:58"],["0:05:38","0:05:42"]],[["0:07:35","0:08:20"],["0:07:20","0:07:25"],["0:07:05","0:07:10"],["0:06:49","0:06:55"],["0:06:34","0:06:39"],["0:06:19","0:06:24"],["0:06:04","0:06:09"],["0:05:49","0:05:53"],["0:05:34","0:05:38"]],[["0:07:29","0:08:14"],["0:07:14","0:07:20"],["0:06:59","0:07:05"],["0:06:44","0:06:49"],["0:06:29","0:06:34"],["0:06:14","0:06:19"],["0:05:59","0:06:04"],["0:05:44","0:05:49"],["0:05:29","0:05:34"]],[["0:07:23","0:08:08"],["0:07:08","0:07:14"],["0:06:54","0:06:59"],["0:06:39","0:06:44"],["0:06:24","0:06:29"],["0:06:09","0:06:14"],["0:05:55","0:05:59"],["0:05:40","0:05:44"],["0:05:25","0:05:29"]],[["0:07:17","0:08:01"],["0:07:03","0:07:08"],["0:06:48","0:06:54"],["0:06:34","0:06:39"],["0:06:19","0:06:24"],["0:06:04","0:06:09"],["0:05:50","0:05:55"],["0:05:35","0:05:40"],["0:05:21","0:05:25"]],[["0:07:12","0:07:55"],["0:06:57","0:07:03"],["0:06:43","0:06:48"],["0:06:28","0:06:34"],["0:06:14","0:06:19"],["0:06:00","0:06:04"],["0:05:45","0:05:50"],["0:05:31","0:05:35"],["0:05:16","0:05:21"]],[["0:07:06","0:07:48"],["0:06:51","0:06:57"],["0:06:37","0:06:43"],["0:06:23","0:06:28"],["0:06:09","0:06:14"],["0:05:55","0:06:00"],["0:05:41","0:05:45"],["0:05:26","0:05:31"],["0:05:12","0:05:16"]],[["0:07:00","0:07:42"],["0:06:46","0:06:51"],["0:06:32","0:06:37"],["0:06:18","0:06:23"],["0:06:04","0:06:09"],["0:05:50","0:05:55"],["0:05:36","0:05:41"],["0:05:22","0:05:26"],["0:05:08","0:05:12"]],[["0:06:54","0:07:35"],["0:06:40","0:06:46"],["0:06:26","0:06:32"],["0:06:13","0:06:18"],["0:05:59","0:06:04"],["0:05:45","0:05:50"],["0:05:31","0:05:36"],["0:05:17","0:05:22"],["0:05:04","0:05:08"]],[["0:06:48","0:07:29"],["0:06:35","0:06:40"],["0:06:21","0:06:26"],["0:06:07","0:06:13"],["0:05:54","0:05:59"],["0:05:40","0:05:45"],["0:05:26","0:05:31"],["0:05:13","0:05:17"],["0:04:59","0:05:04"]],[["0:06:42","0:07:22"],["0:06:29","0:06:35"],["0:06:15","0:06:21"],["0:06:02","0:06:07"],["0:05:49","0:05:54"],["0:05:35","0:05:40"],["0:05:22","0:05:26"],["0:05:08","0:05:13"],["0:04:55","0:04:59"]],[["0:06:36","0:07:16"],["0:06:23","0:06:29"],["0:06:10","0:06:15"],["0:05:57","0:06:02"],["0:05:44","0:05:49"],["0:05:30","0:05:35"],["0:05:17","0:05:22"],["0:05:04","0:05:08"],["0:04:51","0:04:55"]],[["0:06:31","0:07:10"],["0:06:18","0:06:23"],["0:06:05","0:06:10"],["0:05:51","0:05:57"],["0:05:38","0:05:44"],["0:05:25","0:05:30"],["0:05:12","0:05:17"],["0:04:59","0:05:04"],["0:04:46","0:04:51"]],[["0:06:25","0:07:03"],["0:06:12","0:06:18"],["0:05:59","0:06:05"],["0:05:46","0:05:51"],["0:05:33","0:05:38"],["0:05:21","0:05:25"],["0:05:08","0:05:12"],["0:04:55","0:04:59"],["0:04:42","0:04:46"]],[["0:06:19","0:06:57"],["0:06:06","0:06:12"],["0:05:54","0:05:59"],["0:05:41","0:05:46"],["0:05:28","0:05:33"],["0:05:16","0:05:21"],["0:05:03","0:05:08"],["0:04:50","0:04:55"],["0:04:38","0:04:42"]],[["0:06:13","0:06:50"],["0:06:01","0:06:06"],["0:05:48","0:05:54"],["0:05:36","0:05:41"],["0:05:23","0:05:28"],["0:05:11","0:05:16"],["0:04:58","0:05:03"],["0:04:46","0:04:50"],["0:04:34","0:04:38"]],[["0:06:07","0:06:44"],["0:05:55","0:06:01"],["0:05:43","0:05:48"],["0:05:30","0:05:36"],["0:05:18","0:05:23"],["0:05:06","0:05:11"],["0:04:54","0:04:58"],["0:04:41","0:04:46"],["0:04:29","0:04:34"]],[["0:06:01","0:06:37"],["0:05:49","0:05:55"],["0:05:37","0:05:43"],["0:05:25","0:05:30"],["0:05:13","0:05:18"],["0:05:01","0:05:06"],["0:04:49","0:04:54"],["0:04:37","0:04:41"],["0:04:25","0:04:29"]],[["0:05:55","0:06:31"],["0:05:44","0:05:49"],["0:05:32","0:05:37"],["0:05:20","0:05:25"],["0:05:08","0:05:13"],["0:04:56","0:05:01"],["0:04:44","0:04:49"],["0:04:32","0:04:37"],["0:04:21","0:04:25"]],[["0:05:50","0:06:25"],["0:05:38","0:05:44"],["0:05:26","0:05:32"],["0:05:15","0:05:20"],["0:05:03","0:05:08"],["0:04:51","0:04:56"],["0:04:40","0:04:44"],["0:04:28","0:04:32"],["0:04:16","0:04:21"]],[["0:05:44","0:06:18"],["0:05:32","0:05:38"],["0:05:21","0:05:26"],["0:05:09","0:05:15"],["0:04:58","0:05:03"],["0:04:46","0:04:51"],["0:04:35","0:04:40"],["0:04:24","0:04:28"],["0:04:12","0:04:16"]],[["0:05:38","0:06:12"],["0:05:27","0:05:32"],["0:05:15","0:05:21"],["0:05:04","0:05:09"],["0:04:53","0:04:58"],["0:04:42","0:04:46"],["0:04:30","0:04:35"],["0:04:19","0:04:24"],["0:04:08","0:04:12"]],[["0:05:32","0:06:05"],["0:05:21","0:05:27"],["0:05:10","0:05:15"],["0:04:59","0:05:04"],["0:04:48","0:04:53"],["0:04:37","0:04:42"],["0:04:26","0:04:30"],["0:04:15","0:04:19"],["0:04:03","0:04:08"]],[["0:05:26","0:05:59"],["0:05:15","0:05:21"],["0:05:04","0:05:10"],["0:04:54","0:04:59"],["0:04:43","0:04:48"],["0:04:32","0:04:37"],["0:04:21","0:04:26"],["0:04:10","0:04:15"],["0:03:59","0:04:03"]]]\n';
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$MPRData$neutralTraining = '\n[[["0:11:29","0:12:38"],["0:11:04","0:11:09"],["0:10:38","0:10:44"],["0:10:13","0:10:18"],["0:09:48","0:09:53"],["0:09:22","0:09:27"],["0:08:57","0:09:02"],["0:08:32","0:08:36"],["0:08:06","0:08:11"]],[["0:11:23","0:12:31"],["0:10:58","0:11:04"],["0:10:33","0:10:38"],["0:10:08","0:10:13"],["0:09:43","0:09:48"],["0:09:17","0:09:22"],["0:08:52","0:08:57"],["0:08:27","0:08:32"],["0:08:02","0:08:06"]],[["0:11:17","0:12:25"],["0:10:52","0:10:58"],["0:10:27","0:10:33"],["0:10:02","0:10:08"],["0:09:37","0:09:43"],["0:09:13","0:09:17"],["0:08:48","0:08:52"],["0:08:23","0:08:27"],["0:07:58","0:08:02"]],[["0:11:11","0:12:18"],["0:10:46","0:10:52"],["0:10:22","0:10:27"],["0:09:57","0:10:02"],["0:09:32","0:09:37"],["0:09:08","0:09:13"],["0:08:43","0:08:48"],["0:08:18","0:08:23"],["0:07:54","0:07:58"]],[["0:11:05","0:12:11"],["0:10:41","0:10:46"],["0:10:16","0:10:22"],["0:09:52","0:09:57"],["0:09:27","0:09:32"],["0:09:03","0:09:08"],["0:08:38","0:08:43"],["0:08:14","0:08:18"],["0:07:50","0:07:54"]],[["0:10:59","0:12:05"],["0:10:35","0:10:41"],["0:10:11","0:10:16"],["0:09:46","0:09:52"],["0:09:22","0:09:27"],["0:08:58","0:09:03"],["0:08:34","0:08:38"],["0:08:10","0:08:14"],["0:07:45","0:07:50"]],[["0:10:53","0:11:58"],["0:10:29","0:10:35"],["0:10:05","0:10:11"],["0:09:41","0:09:46"],["0:09:17","0:09:22"],["0:08:53","0:08:58"],["0:08:29","0:08:34"],["0:08:05","0:08:10"],["0:07:41","0:07:45"]],[["0:10:47","0:11:52"],["0:10:23","0:10:29"],["0:09:59","0:10:05"],["0:09:36","0:09:41"],["0:09:12","0:09:17"],["0:08:48","0:08:53"],["0:08:24","0:08:29"],["0:08:01","0:08:05"],["0:07:37","0:07:41"]],[["0:10:41","0:11:45"],["0:10:17","0:10:23"],["0:09:54","0:09:59"],["0:09:30","0:09:36"],["0:09:07","0:09:12"],["0:08:43","0:08:48"],["0:08:20","0:08:24"],["0:07:56","0:08:01"],["0:07:33","0:07:37"]],[["0:10:35","0:11:39"],["0:10:12","0:10:17"],["0:09:48","0:09:54"],["0:09:25","0:09:30"],["0:09:02","0:09:07"],["0:08:38","0:08:43"],["0:08:15","0:08:20"],["0:07:52","0:07:56"],["0:07:28","0:07:33"]],[["0:10:29","0:11:32"],["0:10:06","0:10:12"],["0:09:43","0:09:48"],["0:09:20","0:09:25"],["0:08:57","0:09:02"],["0:08:34","0:08:38"],["0:08:10","0:08:15"],["0:07:47","0:07:52"],["0:07:24","0:07:28"]],[["0:10:23","0:11:25"],["0:10:00","0:10:06"],["0:09:37","0:09:43"],["0:09:14","0:09:20"],["0:08:52","0:08:57"],["0:08:29","0:08:34"],["0:08:06","0:08:10"],["0:07:43","0:07:47"],["0:07:20","0:07:24"]],[["0:10:17","0:11:19"],["0:09:54","0:10:00"],["0:09:32","0:09:37"],["0:09:09","0:09:14"],["0:08:46","0:08:52"],["0:08:24","0:08:29"],["0:08:01","0:08:06"],["0:07:38","0:07:43"],["0:07:16","0:07:20"]],[["0:10:11","0:11:12"],["0:09:49","0:09:54"],["0:09:26","0:09:32"],["0:09:04","0:09:09"],["0:08:41","0:08:46"],["0:08:19","0:08:24"],["0:07:56","0:08:01"],["0:07:34","0:07:38"],["0:07:12","0:07:16"]],[["0:10:05","0:11:06"],["0:09:43","0:09:49"],["0:09:21","0:09:26"],["0:08:58","0:09:04"],["0:08:36","0:08:41"],["0:08:14","0:08:19"],["0:07:52","0:07:56"],["0:07:30","0:07:34"],["0:07:07","0:07:12"]],[["0:09:59","0:10:59"],["0:09:37","0:09:43"],["0:09:15","0:09:21"],["0:08:53","0:08:58"],["0:08:31","0:08:36"],["0:08:09","0:08:14"],["0:07:47","0:07:52"],["0:07:25","0:07:30"],["0:07:03","0:07:07"]],[["0:09:53","0:10:52"],["0:09:31","0:09:37"],["0:09:10","0:09:15"],["0:08:48","0:08:53"],["0:08:26","0:08:31"],["0:08:04","0:08:09"],["0:07:42","0:07:47"],["0:07:21","0:07:25"],["0:06:59","0:07:03"]],[["0:09:47","0:10:46"],["0:09:26","0:09:31"],["0:09:04","0:09:10"],["0:08:42","0:08:48"],["0:08:21","0:08:26"],["0:07:59","0:08:04"],["0:07:38","0:07:42"],["0:07:16","0:07:21"],["0:06:55","0:06:59"]],[["0:09:41","0:10:39"],["0:09:20","0:09:26"],["0:08:58","0:09:04"],["0:08:37","0:08:42"],["0:08:16","0:08:21"],["0:07:54","0:07:59"],["0:07:33","0:07:38"],["0:07:12","0:07:16"],["0:06:50","0:06:55"]],[["0:09:35","0:10:33"],["0:09:14","0:09:20"],["0:08:53","0:08:58"],["0:08:32","0:08:37"],["0:08:11","0:08:16"],["0:07:50","0:07:54"],["0:07:28","0:07:33"],["0:07:07","0:07:12"],["0:06:46","0:06:50"]],[["0:09:29","0:10:26"],["0:09:08","0:09:14"],["0:08:47","0:08:53"],["0:08:26","0:08:32"],["0:08:06","0:08:11"],["0:07:45","0:07:50"],["0:07:24","0:07:28"],["0:07:03","0:07:07"],["0:06:42","0:06:46"]],[["0:09:23","0:10:20"],["0:09:03","0:09:08"],["0:08:42","0:08:47"],["0:08:21","0:08:26"],["0:08:00","0:08:06"],["0:07:40","0:07:45"],["0:07:19","0:07:24"],["0:06:58","0:07:03"],["0:06:38","0:06:42"]],[["0:09:17","0:10:13"],["0:08:57","0:09:03"],["0:08:36","0:08:42"],["0:08:16","0:08:21"],["0:07:55","0:08:00"],["0:07:35","0:07:40"],["0:07:14","0:07:19"],["0:06:54","0:06:58"],["0:06:33","0:06:38"]],[["0:09:11","0:10:06"],["0:08:51","0:08:57"],["0:08:31","0:08:36"],["0:08:11","0:08:16"],["0:07:50","0:07:55"],["0:07:30","0:07:35"],["0:07:10","0:07:14"],["0:06:50","0:06:54"],["0:06:29","0:06:33"]],[["0:09:05","0:10:00"],["0:08:45","0:08:51"],["0:08:25","0:08:31"],["0:08:05","0:08:11"],["0:07:45","0:07:50"],["0:07:25","0:07:30"],["0:07:05","0:07:10"],["0:06:45","0:06:50"],["0:06:25","0:06:29"]],[["0:08:59","0:09:53"],["0:08:39","0:08:45"],["0:08:20","0:08:25"],["0:08:00","0:08:05"],["0:07:40","0:07:45"],["0:07:20","0:07:25"],["0:07:00","0:07:05"],["0:06:41","0:06:45"],["0:06:21","0:06:25"]],[["0:08:53","0:09:47"],["0:08:34","0:08:39"],["0:08:14","0:08:20"],["0:07:55","0:08:00"],["0:07:35","0:07:40"],["0:07:15","0:07:20"],["0:06:56","0:07:00"],["0:06:36","0:06:41"],["0:06:17","0:06:21"]],[["0:08:47","0:09:40"],["0:08:28","0:08:34"],["0:08:09","0:08:14"],["0:07:49","0:07:55"],["0:07:30","0:07:35"],["0:07:10","0:07:15"],["0:06:51","0:06:56"],["0:06:32","0:06:36"],["0:06:12","0:06:17"]],[["0:08:41","0:09:33"],["0:08:22","0:08:28"],["0:08:03","0:08:09"],["0:07:44","0:07:49"],["0:07:25","0:07:30"],["0:07:06","0:07:10"],["0:06:46","0:06:51"],["0:06:27","0:06:32"],["0:06:08","0:06:12"]],[["0:08:35","0:09:27"],["0:08:16","0:08:22"],["0:07:57","0:08:03"],["0:07:39","0:07:44"],["0:07:20","0:07:25"],["0:07:01","0:07:06"],["0:06:42","0:06:46"],["0:06:23","0:06:27"],["0:06:04","0:06:08"]],[["0:08:29","0:09:20"],["0:08:11","0:08:16"],["0:07:52","0:07:57"],["0:07:33","0:07:39"],["0:07:15","0:07:20"],["0:06:56","0:07:01"],["0:06:37","0:06:42"],["0:06:18","0:06:23"],["0:06:00","0:06:04"]],[["0:08:23","0:09:14"],["0:08:05","0:08:11"],["0:07:46","0:07:52"],["0:07:28","0:07:33"],["0:07:09","0:07:15"],["0:06:51","0:06:56"],["0:06:32","0:06:37"],["0:06:14","0:06:18"],["0:05:55","0:06:00"]],[["0:08:17","0:09:07"],["0:07:59","0:08:05"],["0:07:41","0:07:46"],["0:07:23","0:07:28"],["0:07:04","0:07:09"],["0:06:46","0:06:51"],["0:06:28","0:06:32"],["0:06:09","0:06:14"],["0:05:51","0:05:55"]],[["0:08:11","0:09:01"],["0:07:53","0:07:59"],["0:07:35","0:07:41"],["0:07:17","0:07:23"],["0:06:59","0:07:04"],["0:06:41","0:06:46"],["0:06:23","0:06:28"],["0:06:05","0:06:09"],["0:05:47","0:05:51"]],[["0:08:05","0:08:54"],["0:07:48","0:07:53"],["0:07:30","0:07:35"],["0:07:12","0:07:17"],["0:06:54","0:06:59"],["0:06:36","0:06:41"],["0:06:18","0:06:23"],["0:06:01","0:06:05"],["0:05:43","0:05:47"]],[["0:07:59","0:08:47"],["0:07:42","0:07:48"],["0:07:24","0:07:30"],["0:07:07","0:07:12"],["0:06:49","0:06:54"],["0:06:31","0:06:36"],["0:06:14","0:06:18"],["0:05:56","0:06:01"],["0:05:39","0:05:43"]],[["0:07:53","0:08:41"],["0:07:36","0:07:42"],["0:07:19","0:07:24"],["0:07:01","0:07:07"],["0:06:44","0:06:49"],["0:06:26","0:06:31"],["0:06:09","0:06:14"],["0:05:52","0:05:56"],["0:05:34","0:05:39"]],[["0:07:47","0:08:34"],["0:07:30","0:07:36"],["0:07:13","0:07:19"],["0:06:56","0:07:01"],["0:06:39","0:06:44"],["0:06:22","0:06:26"],["0:06:04","0:06:09"],["0:05:47","0:05:52"],["0:05:30","0:05:34"]],[["0:07:41","0:08:28"],["0:07:25","0:07:30"],["0:07:08","0:07:13"],["0:06:51","0:06:56"],["0:06:34","0:06:39"],["0:06:17","0:06:22"],["0:06:00","0:06:04"],["0:05:43","0:05:47"],["0:05:26","0:05:30"]],[["0:07:36","0:08:21"],["0:07:19","0:07:25"],["0:07:02","0:07:08"],["0:06:45","0:06:51"],["0:06:29","0:06:34"],["0:06:12","0:06:17"],["0:05:55","0:06:00"],["0:05:38","0:05:43"],["0:05:22","0:05:26"]],[["0:07:30","0:08:14"],["0:07:13","0:07:19"],["0:06:56","0:07:02"],["0:06:40","0:06:45"],["0:06:23","0:06:29"],["0:06:07","0:06:12"],["0:05:50","0:05:55"],["0:05:34","0:05:38"],["0:05:17","0:05:22"]],[["0:07:24","0:08:08"],["0:07:07","0:07:13"],["0:06:51","0:06:56"],["0:06:35","0:06:40"],["0:06:18","0:06:23"],["0:06:02","0:06:07"],["0:05:46","0:05:50"],["0:05:29","0:05:34"],["0:05:13","0:05:17"]],[["0:07:18","0:08:01"],["0:07:01","0:07:07"],["0:06:45","0:06:51"],["0:06:29","0:06:35"],["0:06:13","0:06:18"],["0:05:57","0:06:02"],["0:05:41","0:05:46"],["0:05:25","0:05:29"],["0:05:09","0:05:13"]],[["0:07:12","0:07:55"],["0:06:56","0:07:01"],["0:06:40","0:06:45"],["0:06:24","0:06:29"],["0:06:08","0:06:13"],["0:05:52","0:05:57"],["0:05:36","0:05:41"],["0:05:21","0:05:25"],["0:05:05","0:05:09"]],[["0:07:06","0:07:48"],["0:06:50","0:06:56"],["0:06:34","0:06:40"],["0:06:19","0:06:24"],["0:06:03","0:06:08"],["0:05:47","0:05:52"],["0:05:32","0:05:36"],["0:05:16","0:05:21"],["0:05:01","0:05:05"]],[["0:07:00","0:07:42"],["0:06:44","0:06:50"],["0:06:29","0:06:34"],["0:06:13","0:06:19"],["0:05:58","0:06:03"],["0:05:43","0:05:47"],["0:05:27","0:05:32"],["0:05:12","0:05:16"],["0:04:56","0:05:01"]],[["0:06:54","0:07:35"],["0:06:38","0:06:44"],["0:06:23","0:06:29"],["0:06:08","0:06:13"],["0:05:53","0:05:58"],["0:05:38","0:05:43"],["0:05:22","0:05:27"],["0:05:07","0:05:12"],["0:04:52","0:04:56"]],[["0:06:48","0:07:28"],["0:06:33","0:06:38"],["0:06:18","0:06:23"],["0:06:03","0:06:08"],["0:05:48","0:05:53"],["0:05:33","0:05:38"],["0:05:18","0:05:22"],["0:05:03","0:05:07"],["0:04:48","0:04:52"]],[["0:06:42","0:07:22"],["0:06:27","0:06:33"],["0:06:12","0:06:18"],["0:05:57","0:06:03"],["0:05:43","0:05:48"],["0:05:28","0:05:33"],["0:05:13","0:05:18"],["0:04:58","0:05:03"],["0:04:44","0:04:48"]],[["0:06:36","0:07:15"],["0:06:21","0:06:27"],["0:06:07","0:06:12"],["0:05:52","0:05:57"],["0:05:38","0:05:43"],["0:05:23","0:05:28"],["0:05:08","0:05:13"],["0:04:54","0:04:58"],["0:04:39","0:04:44"]],[["0:06:30","0:07:09"],["0:06:15","0:06:21"],["0:06:01","0:06:07"],["0:05:47","0:05:52"],["0:05:32","0:05:38"],["0:05:18","0:05:23"],["0:05:04","0:05:08"],["0:04:49","0:04:54"],["0:04:35","0:04:39"]],[["0:06:24","0:07:02"],["0:06:10","0:06:15"],["0:05:56","0:06:01"],["0:05:41","0:05:47"],["0:05:27","0:05:32"],["0:05:13","0:05:18"],["0:04:59","0:05:04"],["0:04:45","0:04:49"],["0:04:31","0:04:35"]],[["0:06:18","0:06:55"],["0:06:04","0:06:10"],["0:05:50","0:05:56"],["0:05:36","0:05:41"],["0:05:22","0:05:27"],["0:05:08","0:05:13"],["0:04:54","0:04:59"],["0:04:41","0:04:45"],["0:04:27","0:04:31"]],[["0:06:12","0:06:49"],["0:05:58","0:06:04"],["0:05:44","0:05:50"],["0:05:31","0:05:36"],["0:05:17","0:05:22"],["0:05:03","0:05:08"],["0:04:50","0:04:54"],["0:04:36","0:04:41"],["0:04:22","0:04:27"]],[["0:06:06","0:06:42"],["0:05:52","0:05:58"],["0:05:39","0:05:44"],["0:05:25","0:05:31"],["0:05:12","0:05:17"],["0:04:59","0:05:03"],["0:04:45","0:04:50"],["0:04:32","0:04:36"],["0:04:18","0:04:22"]],[["0:06:00","0:06:36"],["0:05:47","0:05:52"],["0:05:33","0:05:39"],["0:05:20","0:05:25"],["0:05:07","0:05:12"],["0:04:54","0:04:59"],["0:04:40","0:04:45"],["0:04:27","0:04:32"],["0:04:14","0:04:18"]],[["0:05:54","0:06:29"],["0:05:41","0:05:47"],["0:05:28","0:05:33"],["0:05:15","0:05:20"],["0:05:02","0:05:07"],["0:04:49","0:04:54"],["0:04:36","0:04:40"],["0:04:23","0:04:27"],["0:04:10","0:04:14"]],[["0:05:48","0:06:23"],["0:05:35","0:05:41"],["0:05:22","0:05:28"],["0:05:09","0:05:15"],["0:04:57","0:05:02"],["0:04:44","0:04:49"],["0:04:31","0:04:36"],["0:04:18","0:04:23"],["0:04:06","0:04:10"]],[["0:05:42","0:06:16"],["0:05:29","0:05:35"],["0:05:17","0:05:22"],["0:05:04","0:05:09"],["0:04:52","0:04:57"],["0:04:39","0:04:44"],["0:04:26","0:04:31"],["0:04:14","0:04:18"],["0:04:01","0:04:06"]],[["0:05:36","0:06:09"],["0:05:23","0:05:29"],["0:05:11","0:05:17"],["0:04:59","0:05:04"],["0:04:46","0:04:52"],["0:04:34","0:04:39"],["0:04:22","0:04:26"],["0:04:09","0:04:14"],["0:03:57","0:04:01"]]]\n';
var $author$project$MPRData$speedTraining = '\n[[["0:11:46","0:12:57"],["0:11:18","0:11:24"],["0:10:50","0:10:55"],["0:10:22","0:10:27"],["0:09:53","0:09:58"],["0:09:25","0:09:30"],["0:08:57","0:09:01"],["0:08:29","0:08:33"],["0:08:00","0:08:04"]],[["0:11:40","0:12:50"],["0:11:12","0:11:18"],["0:10:44","0:10:50"],["0:10:16","0:10:22"],["0:09:48","0:09:53"],["0:09:20","0:09:25"],["0:08:52","0:08:57"],["0:08:24","0:08:29"],["0:07:56","0:08:00"]],[["0:11:34","0:12:43"],["0:11:06","0:11:12"],["0:10:39","0:10:44"],["0:10:11","0:10:16"],["0:09:43","0:09:48"],["0:09:15","0:09:20"],["0:08:47","0:08:52"],["0:08:20","0:08:24"],["0:07:52","0:07:56"]],[["0:11:28","0:12:37"],["0:11:00","0:11:06"],["0:10:33","0:10:39"],["0:10:05","0:10:11"],["0:09:38","0:09:43"],["0:09:10","0:09:15"],["0:08:43","0:08:47"],["0:08:15","0:08:20"],["0:07:48","0:07:52"]],[["0:11:22","0:12:30"],["0:10:55","0:11:00"],["0:10:27","0:10:33"],["0:10:00","0:10:05"],["0:09:33","0:09:38"],["0:09:05","0:09:10"],["0:08:38","0:08:43"],["0:08:11","0:08:15"],["0:07:44","0:07:48"]],[["0:11:16","0:12:23"],["0:10:49","0:10:55"],["0:10:22","0:10:27"],["0:09:55","0:10:00"],["0:09:28","0:09:33"],["0:09:01","0:09:05"],["0:08:34","0:08:38"],["0:08:07","0:08:11"],["0:07:39","0:07:44"]],[["0:11:10","0:12:17"],["0:10:43","0:10:49"],["0:10:16","0:10:22"],["0:09:49","0:09:55"],["0:09:22","0:09:28"],["0:08:56","0:09:01"],["0:08:29","0:08:34"],["0:08:02","0:08:07"],["0:07:35","0:07:39"]],[["0:11:03","0:12:10"],["0:10:37","0:10:43"],["0:10:10","0:10:16"],["0:09:44","0:09:49"],["0:09:17","0:09:22"],["0:08:51","0:08:56"],["0:08:24","0:08:29"],["0:07:58","0:08:02"],["0:07:31","0:07:35"]],[["0:10:57","0:12:03"],["0:10:31","0:10:37"],["0:10:05","0:10:10"],["0:09:38","0:09:44"],["0:09:12","0:09:17"],["0:08:46","0:08:51"],["0:08:20","0:08:24"],["0:07:53","0:07:58"],["0:07:27","0:07:31"]],[["0:10:51","0:11:56"],["0:10:25","0:10:31"],["0:09:59","0:10:05"],["0:09:33","0:09:38"],["0:09:07","0:09:12"],["0:08:41","0:08:46"],["0:08:15","0:08:20"],["0:07:49","0:07:53"],["0:07:23","0:07:27"]],[["0:10:45","0:11:50"],["0:10:19","0:10:25"],["0:09:54","0:09:59"],["0:09:28","0:09:33"],["0:09:02","0:09:07"],["0:08:36","0:08:41"],["0:08:10","0:08:15"],["0:07:45","0:07:49"],["0:07:19","0:07:23"]],[["0:10:39","0:11:43"],["0:10:13","0:10:19"],["0:09:48","0:09:54"],["0:09:22","0:09:28"],["0:08:57","0:09:02"],["0:08:31","0:08:36"],["0:08:06","0:08:10"],["0:07:40","0:07:45"],["0:07:15","0:07:19"]],[["0:10:33","0:11:36"],["0:10:08","0:10:13"],["0:09:42","0:09:48"],["0:09:17","0:09:22"],["0:08:52","0:08:57"],["0:08:26","0:08:31"],["0:08:01","0:08:06"],["0:07:36","0:07:40"],["0:07:10","0:07:15"]],[["0:10:27","0:11:29"],["0:10:02","0:10:08"],["0:09:37","0:09:42"],["0:09:12","0:09:17"],["0:08:47","0:08:52"],["0:08:21","0:08:26"],["0:07:56","0:08:01"],["0:07:31","0:07:36"],["0:07:06","0:07:10"]],[["0:10:21","0:11:23"],["0:09:56","0:10:02"],["0:09:31","0:09:37"],["0:09:06","0:09:12"],["0:08:41","0:08:47"],["0:08:17","0:08:21"],["0:07:52","0:07:56"],["0:07:27","0:07:31"],["0:07:02","0:07:06"]],[["0:10:15","0:11:16"],["0:09:50","0:09:56"],["0:09:25","0:09:31"],["0:09:01","0:09:06"],["0:08:36","0:08:41"],["0:08:12","0:08:17"],["0:07:47","0:07:52"],["0:07:22","0:07:27"],["0:06:58","0:07:02"]],[["0:10:08","0:11:09"],["0:09:44","0:09:50"],["0:09:20","0:09:25"],["0:08:55","0:09:01"],["0:08:31","0:08:36"],["0:08:07","0:08:12"],["0:07:42","0:07:47"],["0:07:18","0:07:22"],["0:06:54","0:06:58"]],[["0:10:02","0:11:03"],["0:09:38","0:09:44"],["0:09:14","0:09:20"],["0:08:50","0:08:55"],["0:08:26","0:08:31"],["0:08:02","0:08:07"],["0:07:38","0:07:42"],["0:07:14","0:07:18"],["0:06:50","0:06:54"]],[["0:09:56","0:10:56"],["0:09:32","0:09:38"],["0:09:09","0:09:14"],["0:08:45","0:08:50"],["0:08:21","0:08:26"],["0:07:57","0:08:02"],["0:07:33","0:07:38"],["0:07:09","0:07:14"],["0:06:45","0:06:50"]],[["0:09:50","0:10:49"],["0:09:27","0:09:32"],["0:09:03","0:09:09"],["0:08:39","0:08:45"],["0:08:16","0:08:21"],["0:07:52","0:07:57"],["0:07:28","0:07:33"],["0:07:05","0:07:09"],["0:06:41","0:06:45"]],[["0:09:44","0:10:42"],["0:09:21","0:09:27"],["0:08:57","0:09:03"],["0:08:34","0:08:39"],["0:08:11","0:08:16"],["0:07:47","0:07:52"],["0:07:24","0:07:28"],["0:07:00","0:07:05"],["0:06:37","0:06:41"]],[["0:09:38","0:10:36"],["0:09:15","0:09:21"],["0:08:52","0:08:57"],["0:08:29","0:08:34"],["0:08:05","0:08:11"],["0:07:42","0:07:47"],["0:07:19","0:07:24"],["0:06:56","0:07:00"],["0:06:33","0:06:37"]],[["0:09:32","0:10:29"],["0:09:09","0:09:15"],["0:08:46","0:08:52"],["0:08:23","0:08:29"],["0:08:00","0:08:05"],["0:07:37","0:07:42"],["0:07:15","0:07:19"],["0:06:52","0:06:56"],["0:06:29","0:06:33"]],[["0:09:26","0:10:22"],["0:09:03","0:09:09"],["0:08:40","0:08:46"],["0:08:18","0:08:23"],["0:07:55","0:08:00"],["0:07:33","0:07:37"],["0:07:10","0:07:15"],["0:06:47","0:06:52"],["0:06:25","0:06:29"]],[["0:09:20","0:10:16"],["0:08:57","0:09:03"],["0:08:35","0:08:40"],["0:08:12","0:08:18"],["0:07:50","0:07:55"],["0:07:28","0:07:33"],["0:07:05","0:07:10"],["0:06:43","0:06:47"],["0:06:20","0:06:25"]],[["0:09:13","0:10:09"],["0:08:51","0:08:57"],["0:08:29","0:08:35"],["0:08:07","0:08:12"],["0:07:45","0:07:50"],["0:07:23","0:07:28"],["0:07:01","0:07:05"],["0:06:38","0:06:43"],["0:06:16","0:06:20"]],[["0:09:07","0:10:02"],["0:08:45","0:08:51"],["0:08:24","0:08:29"],["0:08:02","0:08:07"],["0:07:40","0:07:45"],["0:07:18","0:07:23"],["0:06:56","0:07:01"],["0:06:34","0:06:38"],["0:06:12","0:06:16"]],[["0:09:01","0:09:55"],["0:08:40","0:08:45"],["0:08:18","0:08:24"],["0:07:56","0:08:02"],["0:07:35","0:07:40"],["0:07:13","0:07:18"],["0:06:51","0:06:56"],["0:06:30","0:06:34"],["0:06:08","0:06:12"]],[["0:08:55","0:09:49"],["0:08:34","0:08:40"],["0:08:12","0:08:18"],["0:07:51","0:07:56"],["0:07:29","0:07:35"],["0:07:08","0:07:13"],["0:06:47","0:06:51"],["0:06:25","0:06:30"],["0:06:04","0:06:08"]],[["0:08:49","0:09:42"],["0:08:28","0:08:34"],["0:08:07","0:08:12"],["0:07:46","0:07:51"],["0:07:24","0:07:29"],["0:07:03","0:07:08"],["0:06:42","0:06:47"],["0:06:21","0:06:25"],["0:06:00","0:06:04"]],[["0:08:43","0:09:35"],["0:08:22","0:08:28"],["0:08:01","0:08:07"],["0:07:40","0:07:46"],["0:07:19","0:07:24"],["0:06:58","0:07:03"],["0:06:37","0:06:42"],["0:06:16","0:06:21"],["0:05:56","0:06:00"]],[["0:08:37","0:09:28"],["0:08:16","0:08:22"],["0:07:55","0:08:01"],["0:07:35","0:07:40"],["0:07:14","0:07:19"],["0:06:53","0:06:58"],["0:06:33","0:06:37"],["0:06:12","0:06:16"],["0:05:51","0:05:56"]],[["0:08:31","0:09:22"],["0:08:10","0:08:16"],["0:07:50","0:07:55"],["0:07:29","0:07:35"],["0:07:09","0:07:14"],["0:06:49","0:06:53"],["0:06:28","0:06:33"],["0:06:08","0:06:12"],["0:05:47","0:05:51"]],[["0:08:25","0:09:15"],["0:08:04","0:08:10"],["0:07:44","0:07:50"],["0:07:24","0:07:29"],["0:07:04","0:07:09"],["0:06:44","0:06:49"],["0:06:23","0:06:28"],["0:06:03","0:06:08"],["0:05:43","0:05:47"]],[["0:08:18","0:09:08"],["0:07:58","0:08:04"],["0:07:39","0:07:44"],["0:07:19","0:07:24"],["0:06:59","0:07:04"],["0:06:39","0:06:44"],["0:06:19","0:06:23"],["0:05:59","0:06:03"],["0:05:39","0:05:43"]],[["0:08:12","0:09:02"],["0:07:53","0:07:58"],["0:07:33","0:07:39"],["0:07:13","0:07:19"],["0:06:54","0:06:59"],["0:06:34","0:06:39"],["0:06:14","0:06:19"],["0:05:54","0:05:59"],["0:05:35","0:05:39"]],[["0:08:06","0:08:55"],["0:07:47","0:07:53"],["0:07:27","0:07:33"],["0:07:08","0:07:13"],["0:06:48","0:06:54"],["0:06:29","0:06:34"],["0:06:10","0:06:14"],["0:05:50","0:05:54"],["0:05:31","0:05:35"]],[["0:08:00","0:08:48"],["0:07:41","0:07:47"],["0:07:22","0:07:27"],["0:07:02","0:07:08"],["0:06:43","0:06:48"],["0:06:24","0:06:29"],["0:06:05","0:06:10"],["0:05:46","0:05:50"],["0:05:26","0:05:31"]],[["0:07:54","0:08:41"],["0:07:35","0:07:41"],["0:07:16","0:07:22"],["0:06:57","0:07:02"],["0:06:38","0:06:43"],["0:06:19","0:06:24"],["0:06:00","0:06:05"],["0:05:41","0:05:46"],["0:05:22","0:05:26"]],[["0:07:48","0:08:35"],["0:07:29","0:07:35"],["0:07:10","0:07:16"],["0:06:52","0:06:57"],["0:06:33","0:06:38"],["0:06:14","0:06:19"],["0:05:56","0:06:00"],["0:05:37","0:05:41"],["0:05:18","0:05:22"]],[["0:07:42","0:08:28"],["0:07:23","0:07:29"],["0:07:05","0:07:10"],["0:06:46","0:06:52"],["0:06:28","0:06:33"],["0:06:09","0:06:14"],["0:05:51","0:05:56"],["0:05:32","0:05:37"],["0:05:14","0:05:18"]],[["0:07:36","0:08:21"],["0:07:17","0:07:23"],["0:06:59","0:07:05"],["0:06:41","0:06:46"],["0:06:23","0:06:28"],["0:06:04","0:06:09"],["0:05:46","0:05:51"],["0:05:28","0:05:32"],["0:05:10","0:05:14"]],[["0:07:30","0:08:14"],["0:07:12","0:07:17"],["0:06:54","0:06:59"],["0:06:36","0:06:41"],["0:06:18","0:06:23"],["0:06:00","0:06:04"],["0:05:42","0:05:46"],["0:05:24","0:05:28"],["0:05:06","0:05:10"]],[["0:07:23","0:08:08"],["0:07:06","0:07:12"],["0:06:48","0:06:54"],["0:06:30","0:06:36"],["0:06:12","0:06:18"],["0:05:55","0:06:00"],["0:05:37","0:05:42"],["0:05:19","0:05:24"],["0:05:02","0:05:06"]],[["0:07:17","0:08:01"],["0:07:00","0:07:06"],["0:06:42","0:06:48"],["0:06:25","0:06:30"],["0:06:07","0:06:12"],["0:05:50","0:05:55"],["0:05:32","0:05:37"],["0:05:15","0:05:19"],["0:04:57","0:05:02"]],[["0:07:11","0:07:54"],["0:06:54","0:07:00"],["0:06:37","0:06:42"],["0:06:19","0:06:25"],["0:06:02","0:06:07"],["0:05:45","0:05:50"],["0:05:28","0:05:32"],["0:05:10","0:05:15"],["0:04:53","0:04:57"]],[["0:07:05","0:07:48"],["0:06:48","0:06:54"],["0:06:31","0:06:37"],["0:06:14","0:06:19"],["0:05:57","0:06:02"],["0:05:40","0:05:45"],["0:05:23","0:05:28"],["0:05:06","0:05:10"],["0:04:49","0:04:53"]],[["0:06:59","0:07:41"],["0:06:42","0:06:48"],["0:06:25","0:06:31"],["0:06:09","0:06:14"],["0:05:52","0:05:57"],["0:05:35","0:05:40"],["0:05:18","0:05:23"],["0:05:02","0:05:06"],["0:04:45","0:04:49"]],[["0:06:53","0:07:34"],["0:06:36","0:06:42"],["0:06:20","0:06:25"],["0:06:03","0:06:09"],["0:05:47","0:05:52"],["0:05:30","0:05:35"],["0:05:14","0:05:18"],["0:04:57","0:05:02"],["0:04:41","0:04:45"]],[["0:06:47","0:07:27"],["0:06:30","0:06:36"],["0:06:14","0:06:20"],["0:05:58","0:06:03"],["0:05:42","0:05:47"],["0:05:25","0:05:30"],["0:05:09","0:05:14"],["0:04:53","0:04:57"],["0:04:37","0:04:41"]],[["0:06:41","0:07:21"],["0:06:25","0:06:30"],["0:06:09","0:06:14"],["0:05:53","0:05:58"],["0:05:37","0:05:42"],["0:05:20","0:05:25"],["0:05:04","0:05:09"],["0:04:48","0:04:53"],["0:04:32","0:04:37"]],[["0:06:34","0:07:14"],["0:06:19","0:06:25"],["0:06:03","0:06:09"],["0:05:47","0:05:53"],["0:05:31","0:05:37"],["0:05:16","0:05:20"],["0:05:00","0:05:04"],["0:04:44","0:04:48"],["0:04:28","0:04:32"]],[["0:06:28","0:07:07"],["0:06:13","0:06:19"],["0:05:57","0:06:03"],["0:05:42","0:05:47"],["0:05:26","0:05:31"],["0:05:11","0:05:16"],["0:04:55","0:05:00"],["0:04:40","0:04:44"],["0:04:24","0:04:28"]],[["0:06:22","0:07:00"],["0:06:07","0:06:13"],["0:05:52","0:05:57"],["0:05:36","0:05:42"],["0:05:21","0:05:26"],["0:05:06","0:05:11"],["0:04:51","0:04:55"],["0:04:35","0:04:40"],["0:04:20","0:04:24"]],[["0:06:16","0:06:54"],["0:06:01","0:06:07"],["0:05:46","0:05:52"],["0:05:31","0:05:36"],["0:05:16","0:05:21"],["0:05:01","0:05:06"],["0:04:46","0:04:51"],["0:04:31","0:04:35"],["0:04:16","0:04:20"]],[["0:06:10","0:06:47"],["0:05:55","0:06:01"],["0:05:40","0:05:46"],["0:05:26","0:05:31"],["0:05:11","0:05:16"],["0:04:56","0:05:01"],["0:04:41","0:04:46"],["0:04:26","0:04:31"],["0:04:12","0:04:16"]],[["0:06:04","0:06:40"],["0:05:49","0:05:55"],["0:05:35","0:05:40"],["0:05:20","0:05:26"],["0:05:06","0:05:11"],["0:04:51","0:04:56"],["0:04:37","0:04:41"],["0:04:22","0:04:26"],["0:04:07","0:04:12"]],[["0:05:58","0:06:34"],["0:05:43","0:05:49"],["0:05:29","0:05:35"],["0:05:15","0:05:20"],["0:05:01","0:05:06"],["0:04:46","0:04:51"],["0:04:32","0:04:37"],["0:04:18","0:04:22"],["0:04:03","0:04:07"]],[["0:05:52","0:06:27"],["0:05:38","0:05:43"],["0:05:24","0:05:29"],["0:05:09","0:05:15"],["0:04:55","0:05:01"],["0:04:41","0:04:46"],["0:04:27","0:04:32"],["0:04:13","0:04:18"],["0:03:59","0:04:03"]],[["0:05:46","0:06:20"],["0:05:32","0:05:38"],["0:05:18","0:05:24"],["0:05:04","0:05:09"],["0:04:50","0:04:55"],["0:04:36","0:04:41"],["0:04:23","0:04:27"],["0:04:09","0:04:13"],["0:03:55","0:03:59"]]]\n';
var $author$project$MPRLevel$toTuple = function (l) {
	if ((l.b && l.b.b) && (!l.b.b.b)) {
		var a = l.a;
		var _v1 = l.b;
		var b = _v1.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(a, b));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MPRLevel$trainingPacesTable = function (runnerType) {
	var json = function () {
		switch (runnerType) {
			case 0:
				return $author$project$MPRData$neutralTraining;
			case 1:
				return $author$project$MPRData$aerobicTraining;
			default:
				return $author$project$MPRData$speedTraining;
		}
	}();
	return A2(
		$elm$core$Array$map,
		function (a) {
			return A2(
				$elm$core$Array$map,
				function (t) {
					return A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2('', ''),
						$author$project$MPRLevel$toTuple(t));
				},
				a);
		},
		A2(
			$elm$core$Result$withDefault,
			$elm$core$Array$empty,
			A2(
				$elm$json$Json$Decode$decodeString,
				$elm$json$Json$Decode$array(
					$elm$json$Json$Decode$array(
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string))),
				json)));
};
var $author$project$MPRLevel$trainingPaces = function (_v0) {
	var runnerType = _v0.a;
	var level = _v0.b;
	var res = A2(
		$elm$core$Array$get,
		level - 1,
		$author$project$MPRLevel$trainingPacesTable(runnerType));
	if (!res.$) {
		var arr = res.a;
		return $elm$core$Result$Ok(
			A3(
				$elm$core$List$map2,
				F2(
					function (x, y) {
						return A2($elm$core$Tuple$pair, x, y);
					}),
				$author$project$MPRLevel$paceList,
				$elm$core$Array$toList(arr)));
	} else {
		return $elm$core$Result$Err('out of range');
	}
};
var $author$project$ActivityForm$paceSelect = F3(
	function (levelM, msg, pace) {
		var paceTimes = function () {
			if (!levelM.$) {
				var level = levelM.a;
				return A2(
					$elm$core$Result$withDefault,
					A2(
						$elm$core$List$repeat,
						$elm$core$List$length($author$project$Activity$pace.Q),
						''),
					A2(
						$elm$core$Result$map,
						$elm$core$List$map(
							function (_v1) {
								var name = _v1.a;
								var _v2 = _v1.b;
								var minPace = _v2.a;
								var maxPace = _v2.b;
								return $author$project$MPRLevel$stripTimeStr(maxPace);
							}),
						$author$project$MPRLevel$trainingPaces(
							_Utils_Tuple2(0, level))));
			} else {
				return A2(
					$elm$core$List$repeat,
					$elm$core$List$length($author$project$Activity$pace.Q),
					'');
			}
		}();
		var paceNames = A2($elm$core$List$map, $elm$core$Tuple$first, $author$project$Activity$pace.Q);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown medium')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button medium')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Activity$pace.bC(pace))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-content')
						]),
					A3(
						$elm$core$List$map2,
						F2(
							function (name, time) {
								return A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											msg(name)),
											A2($elm$html$Html$Attributes$style, 'text-align', 'left')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', 'var(--accent-blue)'),
													A2($elm$html$Html$Attributes$style, 'margin-right', '0.5rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(time)
												])),
											$elm$html$Html$text(name)
										]));
							}),
						paceNames,
						paceTimes))
				]));
	});
var $author$project$Msg$SelectedShape = function (a) {
	return {$: 30, a: a};
};
var $author$project$Activity$activityTypeToString = function (aType) {
	switch (aType.$) {
		case 0:
			return 'Run';
		case 1:
			return 'Interval';
		case 2:
			return 'Race';
		case 3:
			return 'Other';
		case 4:
			return 'Note';
		default:
			return 'Session';
	}
};
var $author$project$ActivityShape$Block = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$ActivityShape$Circle = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$ActivityShape$Emoji = function (a) {
	return {$: 2, a: a};
};
var $author$project$ActivityShape$Gray = 3;
var $author$project$ActivityShape$Green = 0;
var $author$project$ActivityShape$Orange = 1;
var $author$project$ActivityShape$Red = 2;
var $author$project$ActivityShape$colorString = function (color) {
	switch (color) {
		case 0:
			return 'var(--activity-green)';
		case 1:
			return 'var(--activity-orange)';
		case 2:
			return 'red';
		default:
			return 'var(--activity-gray)';
	}
};
var $author$project$Emoji$find = function (name) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Emoji$default,
		$elm$core$List$head(
			$author$project$Emoji$filter(name)));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Char$toUpper = _Char_toUpper;
var $author$project$ActivityShape$viewShape = function (shape) {
	switch (shape.$) {
		case 0:
			var color = shape.a;
			var completed = shape.b;
			var width = shape.c.y;
			var height = shape.c.u;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'width',
						$elm$core$String$fromFloat(width * 0.3) + 'rem'),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$elm$core$String$fromFloat(height) + 'rem'),
						A2(
						$elm$html$Html$Attributes$style,
						'border',
						'2px solid ' + $author$project$ActivityShape$colorString(color)),
						A2($elm$html$Html$Attributes$style, 'border-radius', '2px'),
						$elm$html$Html$Attributes$class('block'),
						completed ? A2(
						$elm$html$Html$Attributes$style,
						'background-color',
						$author$project$ActivityShape$colorString(color)) : A2($elm$html$Html$Attributes$style, 'background-color', 'white')
					]),
				_List_Nil);
		case 1:
			var color = shape.a;
			var completed = shape.b;
			var charM = shape.c;
			var _v1 = completed ? _Utils_Tuple2(
				$author$project$ActivityShape$colorString(color),
				'white') : _Utils_Tuple2(
				'white',
				$author$project$ActivityShape$colorString(color));
			var backgroundColor = _v1.a;
			var textColor = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '1rem'),
						A2($elm$html$Html$Attributes$style, 'height', '1rem'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
						A2(
						$elm$html$Html$Attributes$style,
						'border',
						'2px solid ' + $author$project$ActivityShape$colorString(color)),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
						A2($elm$html$Html$Attributes$style, 'font-size', '0.8rem'),
						A2($elm$html$Html$Attributes$style, 'background-color', backgroundColor),
						A2($elm$html$Html$Attributes$style, 'color', textColor)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$map,
								$elm$core$String$fromChar,
								A2($elm$core$Maybe$map, $elm$core$Char$toUpper, charM))))
					]));
		default:
			var name = shape.a;
			return $author$project$Emoji$view(
				$author$project$Emoji$find(name));
	}
};
var $author$project$ActivityShape$viewDefault = F2(
	function (completed, activityData) {
		switch (activityData.$) {
			case 0:
				return $author$project$ActivityShape$viewShape(
					A3(
						$author$project$ActivityShape$Block,
						0,
						completed,
						{u: 1, y: 3}));
			case 1:
				return $author$project$ActivityShape$viewShape(
					A3(
						$author$project$ActivityShape$Block,
						1,
						completed,
						{u: 1, y: 3}));
			case 2:
				return $author$project$ActivityShape$viewShape(
					A3(
						$author$project$ActivityShape$Block,
						2,
						completed,
						{u: 1, y: 3}));
			case 3:
				return $author$project$ActivityShape$viewShape(
					A3($author$project$ActivityShape$Circle, 3, completed, $elm$core$Maybe$Nothing));
			case 4:
				return $author$project$ActivityShape$viewShape(
					$author$project$ActivityShape$Emoji($author$project$Emoji$default.aa));
			default:
				return $author$project$ActivityShape$viewShape(
					A3(
						$author$project$ActivityShape$Block,
						1,
						completed,
						{u: 1, y: 3}));
		}
	});
var $author$project$Skeleton$viewIf = F2(
	function (bool, html) {
		return bool ? html : $elm$html$Html$text('');
	});
var $author$project$ActivityForm$shapeSelect = function (model) {
	var typeStr = $author$project$Activity$activityTypeToString(
		$author$project$ActivityForm$toActivityData(model.g));
	var _v0 = $author$project$ActivityForm$defaults(model.g);
	var duration = _v0.f;
	var pace = _v0.l;
	var distance = _v0.p;
	var emoji = _v0.t;
	var completed = _v0.e;
	var types = _List_fromArray(
		[
			A3($author$project$Activity$Run, duration, pace, completed),
			A3($author$project$Activity$Interval, duration, pace, completed),
			A3($author$project$Activity$Race, duration, distance, completed),
			A2($author$project$Activity$Other, duration, completed),
			$author$project$Activity$Note(emoji)
		]);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dropdown medium')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('button medium')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(typeStr)
					])),
				A2(
				$author$project$Skeleton$viewIf,
				typeStr !== 'Session',
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-content')
						]),
					A2(
						$elm$core$List$map,
						function (aType) {
							return A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Msg$SelectedShape(aType))
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Skeleton$row,
										_List_Nil,
										_List_fromArray(
											[
												A2($author$project$ActivityShape$viewDefault, true, aType),
												A2(
												$author$project$Skeleton$compactColumn,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'margin-left', '0.5rem'),
														A2($elm$html$Html$Attributes$style, 'margin-top', '0.1rem')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$author$project$Activity$activityTypeToString(aType))
													]))
											]))
									]));
						},
						types)))
			]));
};
var $author$project$Msg$ClickedClose = {$: 41};
var $author$project$Msg$ClickedCopy = function (a) {
	return {$: 38, a: a};
};
var $author$project$Msg$ClickedMove = function (a) {
	return {$: 39, a: a};
};
var $author$project$Msg$Delete = function (a) {
	return {$: 16, a: a};
};
var $author$project$Msg$EditActivity = function (a) {
	return {$: 28, a: a};
};
var $author$project$Msg$Shift = F2(
	function (a, b) {
		return {$: 15, a: a, b: b};
	});
var $author$project$Msg$Ungroup = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $author$project$Skeleton$attributeIf = F2(
	function (bool, attr) {
		return bool ? attr : A2($elm$html$Html$Attributes$style, '', '');
	});
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$ActivityForm$toolbarButton = F3(
	function (onClickMsg, iconClass, primary) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('button small expand'),
					A2(
					$author$project$Skeleton$attributeIf,
					primary,
					$elm$html$Html$Attributes$class('primary')),
					A2($elm$html$Html$Attributes$style, 'margin-right', '0.2rem'),
					A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
					A2($elm$html$Html$Attributes$style, 'max-width', '3rem'),
					$elm$html$Html$Events$onClick(onClickMsg)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$i,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(iconClass)
						]),
					_List_Nil)
				]));
	});
var $author$project$ActivityForm$viewButtons = F2(
	function (activity, editing) {
		return A2(
			$author$project$Skeleton$row,
			_List_Nil,
			_List_fromArray(
				[
					editing ? A3($author$project$ActivityForm$toolbarButton, $author$project$Msg$ClickedSubmit, 'mi-check', true) : A3(
					$author$project$ActivityForm$toolbarButton,
					$author$project$Msg$EditActivity(activity),
					'mi-edit',
					false),
					A3(
					$author$project$ActivityForm$toolbarButton,
					$author$project$Msg$ClickedCopy(activity),
					'mi-copy',
					false),
					A3(
					$author$project$ActivityForm$toolbarButton,
					$author$project$Msg$Delete(activity),
					'mi-delete',
					false),
					A2($author$project$Skeleton$column, _List_Nil, _List_Nil),
					A3(
					$author$project$ActivityForm$toolbarButton,
					$author$project$Msg$ClickedMove(activity),
					'mi-calendar',
					false),
					A3(
					$author$project$ActivityForm$toolbarButton,
					A2($author$project$Msg$Shift, true, activity),
					'mi-arrow-up',
					false),
					A3(
					$author$project$ActivityForm$toolbarButton,
					A2($author$project$Msg$Shift, false, activity),
					'mi-arrow-down',
					false),
					A2($author$project$Skeleton$column, _List_Nil, _List_Nil),
					function () {
					var _v0 = activity.T;
					if (_v0.$ === 5) {
						var activities = _v0.a;
						return A3(
							$author$project$ActivityForm$toolbarButton,
							A2($author$project$Msg$Ungroup, activities, activity),
							'mi-folder',
							false);
					} else {
						return $elm$html$Html$text('');
					}
				}(),
					A2($author$project$Skeleton$column, _List_Nil, _List_Nil),
					A3($author$project$ActivityForm$toolbarButton, $author$project$Msg$ClickedClose, 'mi-close', false)
				]));
	});
var $author$project$ActivityForm$errorMessage = function (error) {
	if (error.$ === 1) {
		var field = error.a;
		return 'Please fill in ' + (field + ' field');
	} else {
		return 'There has been an error';
	}
};
var $author$project$ActivityForm$viewError = function (errorR) {
	if (errorR.$ === 1) {
		var error = errorR.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$ActivityForm$errorMessage(error))
				]));
	} else {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error')
				]),
			_List_Nil);
	}
};
var $author$project$Skeleton$viewMaybe = F2(
	function (attrM, viewF) {
		if (!attrM.$) {
			var attr = attrM.a;
			return viewF(attr);
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Msg$ClickedGroup = {$: 40};
var $author$project$ActivityForm$viewMultiSelectButtons = function (activities) {
	return A2(
		$author$project$Skeleton$row,
		_List_Nil,
		_List_fromArray(
			[
				A3($author$project$ActivityForm$toolbarButton, $author$project$Msg$ClickedGroup, 'mi-folder', false)
			]));
};
var $author$project$Msg$CheckedCompleted = {$: 33};
var $author$project$ActivityShape$toHeight = function (duration) {
	return duration / 10;
};
var $author$project$ActivityShape$toIntervalHeight = function (duration) {
	return duration / 600;
};
var $author$project$ActivityShape$toWidth = function (pace) {
	switch (pace) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		default:
			return 9;
	}
};
var $author$project$ActivityShape$view = function (activity) {
	var _v0 = activity.T;
	switch (_v0.$) {
		case 0:
			var mins = _v0.a;
			var pace = _v0.b;
			var completed = _v0.c;
			return $author$project$ActivityShape$viewShape(
				A3(
					$author$project$ActivityShape$Block,
					0,
					completed,
					{
						u: $author$project$ActivityShape$toHeight(mins),
						y: $author$project$ActivityShape$toWidth(pace)
					}));
		case 1:
			var secs = _v0.a;
			var pace = _v0.b;
			var completed = _v0.c;
			return $author$project$ActivityShape$viewShape(
				A3(
					$author$project$ActivityShape$Block,
					1,
					completed,
					{
						u: $author$project$ActivityShape$toIntervalHeight(secs),
						y: $author$project$ActivityShape$toWidth(pace)
					}));
		case 2:
			var mins = _v0.a;
			var dist = _v0.b;
			var completed = _v0.c;
			return $author$project$ActivityShape$viewShape(
				A3(
					$author$project$ActivityShape$Block,
					2,
					completed,
					{
						u: $author$project$ActivityShape$toHeight(mins),
						y: $author$project$ActivityShape$toWidth(
							A2($elm$core$Maybe$withDefault, 5, $elm$core$Maybe$Nothing))
					}));
		case 3:
			var mins = _v0.a;
			var completed = _v0.b;
			return $author$project$ActivityShape$viewShape(
				A3(
					$author$project$ActivityShape$Circle,
					3,
					completed,
					$elm$core$List$head(
						$elm$core$String$toList(activity.ap))));
		case 4:
			var emoji = _v0.a;
			return $author$project$ActivityShape$viewShape(
				$author$project$ActivityShape$Emoji(emoji));
		default:
			var activities = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				A2($elm$core$List$map, $author$project$ActivityShape$view, activities));
	}
};
var $author$project$ActivityForm$viewShape = function (model) {
	var activityShape = A2(
		$elm$core$Maybe$withDefault,
		A2(
			$author$project$ActivityShape$viewDefault,
			true,
			A3($author$project$Activity$Run, 30, 0, true)),
		A2(
			$elm$core$Maybe$map,
			$author$project$ActivityShape$view,
			$elm$core$Result$toMaybe(
				$author$project$ActivityForm$validate(model))));
	return A2(
		$author$project$Skeleton$compactColumn,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dynamic-shape'),
				A2($elm$html$Html$Attributes$style, 'flex-basis', '3.3rem'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				$elm$html$Html$Events$onClick($author$project$Msg$CheckedCompleted)
			]),
		_List_fromArray(
			[activityShape]));
};
var $author$project$ActivityForm$view = F2(
	function (levelM, activityM) {
		var sharedAttributes = _List_fromArray(
			[
				$author$project$Skeleton$borderStyle('border-bottom'),
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'right', '0'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
				A2($elm$html$Html$Attributes$style, 'z-index', '2')
			]);
		var openAttributes = F2(
			function (minHeight, maxHeight) {
				return _Utils_ap(
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'transition', 'max-height 0.5s, min-height 0.5s'),
							A2($elm$html$Html$Attributes$style, 'max-height', maxHeight),
							A2($elm$html$Html$Attributes$style, 'min-height', minHeight),
							A2($elm$html$Html$Attributes$style, 'padding', '0.5rem 0.5rem'),
							A2($elm$html$Html$Attributes$style, 'border-width', '1px')
						]),
					sharedAttributes);
			});
		var dataInputs = F2(
			function (form, result) {
				switch (form.$) {
					case 0:
						var duration = form.a.f;
						var pace = form.a.l;
						return _List_fromArray(
							[
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$durationInput, $author$project$Msg$EditedDuration, false, duration)
									])),
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$paceSelect, levelM, $author$project$Msg$SelectedPace, pace)
									]))
							]);
					case 1:
						var duration = form.a.f;
						var pace = form.a.l;
						return _List_fromArray(
							[
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$durationInput, $author$project$Msg$EditedDuration, true, duration)
									])),
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$paceSelect, levelM, $author$project$Msg$SelectedPace, pace)
									]))
							]);
					case 2:
						var duration = form.a.f;
						var distance = form.a.p;
						return _List_fromArray(
							[
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$durationInput, $author$project$Msg$EditedDuration, false, duration)
									])),
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A2($author$project$ActivityForm$distanceSelect, $author$project$Msg$SelectedDistance, distance)
									])),
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$author$project$Skeleton$viewMaybe,
										A2(
											$elm$core$Maybe$andThen,
											$author$project$Activity$mprLevel,
											$elm$core$Result$toMaybe(result)),
										function (level) {
											return $elm$html$Html$text(
												'Level ' + $elm$core$String$fromInt(level));
										})
									]))
							]);
					case 3:
						var duration = form.a.f;
						return _List_fromArray(
							[
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A3($author$project$ActivityForm$durationInput, $author$project$Msg$EditedDuration, false, duration)
									]))
							]);
					case 4:
						var emoji = form.a.t;
						return _List_fromArray(
							[
								A2(
								$author$project$Skeleton$compactColumn,
								_List_Nil,
								_List_fromArray(
									[
										A2($author$project$ActivityForm$emojiSelect, $author$project$Msg$SelectedEmoji, emoji)
									]))
							]);
					default:
						return _List_Nil;
				}
			});
		var closedAttributes = _Utils_ap(
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'transition', 'max-height 0.5s, min-height 0.5s, border-width 0.5s 0.1s'),
					A2($elm$html$Html$Attributes$style, 'min-height', '0'),
					A2($elm$html$Html$Attributes$style, 'max-height', '0'),
					A2($elm$html$Html$Attributes$style, 'border-width', '0')
				]),
			sharedAttributes);
		switch (activityM.$) {
			case 0:
				if (activityM.a.b && (!activityM.a.b.b)) {
					var _v1 = activityM.a;
					var activity = _v1.a;
					return A2(
						$author$project$Skeleton$row,
						A2(openAttributes, '1rem', '2rem'),
						_List_fromArray(
							[
								A2(
								$author$project$Skeleton$column,
								_List_Nil,
								_List_fromArray(
									[
										A2($author$project$ActivityForm$viewButtons, activity, false)
									]))
							]));
				} else {
					var activities = activityM.a;
					return A2(
						$author$project$Skeleton$row,
						A2(openAttributes, '1rem', '2rem'),
						_List_fromArray(
							[
								A2(
								$author$project$Skeleton$column,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$ActivityForm$viewMultiSelectButtons(activities)
									]))
							]));
				}
			case 1:
				var model = activityM.a;
				return A2(
					$author$project$Skeleton$row,
					A2(openAttributes, '5rem', '20rem'),
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$column,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$author$project$Skeleton$row,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$author$project$Skeleton$viewMaybe,
											$elm$core$Result$toMaybe(model.L),
											function (activity) {
												return A2(
													$author$project$Skeleton$column,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'margin-bottom', '1rem')
														]),
													_List_fromArray(
														[
															A2($author$project$ActivityForm$viewButtons, activity, true)
														]));
											})
										])),
									A2(
									$author$project$Skeleton$row,
									_List_Nil,
									_List_fromArray(
										[
											$author$project$ActivityForm$viewShape(model),
											A2(
											$author$project$Skeleton$column,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$author$project$Skeleton$row,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															A2(
																$elm$core$Maybe$withDefault,
																'Select Date',
																A2(
																	$elm$core$Maybe$map,
																	$justinmimbs$date$Date$format('E MMM d'),
																	model.an)))
														])),
													A2(
													$author$project$Skeleton$row,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$input,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$type_('text'),
																	$elm$html$Html$Attributes$autocomplete(false),
																	$elm$html$Html$Attributes$placeholder('Description'),
																	$elm$html$Html$Events$onInput($author$project$Msg$EditedDescription),
																	$elm$html$Html$Attributes$name('description'),
																	$elm$html$Html$Attributes$value(model.ap),
																	A2($elm$html$Html$Attributes$style, 'width', '100%')
																]),
															_List_Nil)
														])),
													A2(
													$author$project$Skeleton$row,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
															A2($elm$html$Html$Attributes$style, 'align-items', 'center')
														]),
													A2(
														$elm$core$List$cons,
														A2(
															$author$project$Skeleton$compactColumn,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$style, 'margin-right', '0.2rem')
																]),
															_List_fromArray(
																[
																	$author$project$ActivityForm$shapeSelect(model)
																])),
														A2(dataInputs, model.g, model.L))),
													A2(
													$author$project$Skeleton$row,
													_List_Nil,
													_List_fromArray(
														[
															$author$project$ActivityForm$viewError(model.L)
														]))
												]))
										]))
								]))
						]));
			default:
				return A2($author$project$Skeleton$row, closedAttributes, _List_Nil);
		}
	});
var $author$project$Msg$Day = 2;
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Calendar$filterActivities = F2(
	function (date, activities) {
		return A2(
			$elm$core$List$filter,
			function (a) {
				return _Utils_eq(a.an, date);
			},
			activities);
	});
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$virtual_dom$VirtualDom$lazy5 = _VirtualDom_lazy5;
var $elm$html$Html$Lazy$lazy5 = $elm$virtual_dom$VirtualDom$lazy5;
var $justinmimbs$date$Date$Day = 11;
var $justinmimbs$date$Date$rangeHelp = F5(
	function (unit, step, until, revList, current) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(current, until) < 0) {
				var _v0 = A3($justinmimbs$date$Date$add, unit, step, current);
				var next = _v0;
				var $temp$unit = unit,
					$temp$step = step,
					$temp$until = until,
					$temp$revList = A2($elm$core$List$cons, current, revList),
					$temp$current = next;
				unit = $temp$unit;
				step = $temp$step;
				until = $temp$until;
				revList = $temp$revList;
				current = $temp$current;
				continue rangeHelp;
			} else {
				return $elm$core$List$reverse(revList);
			}
		}
	});
var $justinmimbs$date$Date$range = F4(
	function (interval, step, _v0, _v1) {
		var start = _v0;
		var until = _v1;
		var _v2 = $justinmimbs$date$Date$intervalToUnits(interval);
		var n = _v2.a;
		var unit = _v2.b;
		var _v3 = A2($justinmimbs$date$Date$ceiling, interval, start);
		var first = _v3;
		return (_Utils_cmp(first, until) < 0) ? A5(
			$justinmimbs$date$Date$rangeHelp,
			unit,
			A2($elm$core$Basics$max, 1, step) * n,
			until,
			_List_Nil,
			first) : _List_Nil;
	});
var $author$project$Calendar$listDays = F2(
	function (start, end) {
		return A4($justinmimbs$date$Date$range, 11, 1, start, end);
	});
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Calendar$onScroll = function (_v0) {
	var loadPrevious = _v0.a;
	var loadNext = _v0.b;
	var loadMargin = 10;
	return A2(
		$elm$html$Html$Events$on,
		'scroll',
		A2(
			$elm$json$Json$Decode$andThen,
			function (_v1) {
				var scrollTop = _v1.a;
				var scrollHeight = _v1.b;
				var clientHeight = _v1.c;
				return (_Utils_cmp(scrollTop, loadMargin) < 0) ? $elm$json$Json$Decode$succeed(
					loadPrevious(scrollHeight)) : ((_Utils_cmp(scrollTop, (scrollHeight - clientHeight) - loadMargin) > 0) ? $elm$json$Json$Decode$succeed(
					loadNext(scrollHeight)) : $elm$json$Json$Decode$fail(''));
			},
			A4(
				$elm$json$Json$Decode$map3,
				F3(
					function (a, b, c) {
						return _Utils_Tuple3(a, b, c);
					}),
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'scrollTop']),
					$elm$json$Json$Decode$int),
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'scrollHeight']),
					$elm$json$Json$Decode$int),
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'clientHeight']),
					$elm$json$Json$Decode$int))));
};
var $author$project$Msg$Scroll = F3(
	function (a, b, c) {
		return {$: 21, a: a, b: b, c: c};
	});
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Calendar$scrollHandler = function (_v0) {
	var zoom = _v0.a;
	var start = _v0.b;
	var end = _v0.c;
	return A3(
		$elm$core$Tuple$mapBoth,
		$author$project$Msg$Scroll(true),
		$author$project$Msg$Scroll(false),
		_Utils_Tuple2(
			A3($justinmimbs$date$Date$add, 1, -2, start),
			A3($justinmimbs$date$Date$add, 1, 2, end)));
};
var $author$project$Skeleton$spinner = function (fontSize) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('spinner'),
				A2($elm$html$Html$Attributes$style, 'width', fontSize),
				A2($elm$html$Html$Attributes$style, 'height', fontSize)
			]),
		_List_Nil);
};
var $author$project$Skeleton$styleIf = F3(
	function (bool, name, value) {
		return bool ? A2($elm$html$Html$Attributes$style, name, value) : A2($elm$html$Html$Attributes$style, '', '');
	});
var $justinmimbs$date$Date$toIsoString = $justinmimbs$date$Date$format('yyyy-MM-dd');
var $author$project$Msg$MoveActivity = function (a) {
	return {$: 24, a: a};
};
var $author$project$Msg$SelectActivity = F2(
	function (a, b) {
		return {$: 27, a: a, b: b};
	});
var $author$project$Calendar$pointerDownDecoder = function (activity) {
	return A2(
		$elm$json$Json$Decode$map,
		$author$project$Msg$SelectActivity(activity),
		A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
};
var $author$project$Calendar$viewActivity = F3(
	function (isActive, isActiveDate, activity) {
		var level = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (l) {
					return 'level ' + $elm$core$String$fromInt(l);
				},
				$author$project$Activity$mprLevel(activity)));
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'padding', '0.5rem 0.5rem'),
					A3($author$project$Skeleton$styleIf, isActive, 'background-color', 'var(--highlight-gray)')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$compactColumn,
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$attributeIf,
							isActive,
							A2(
								$elm$html$Html$Events$on,
								'pointerdown',
								$elm$json$Json$Decode$succeed(
									$author$project$Msg$MoveActivity(activity)))),
							A2(
							$author$project$Skeleton$attributeIf,
							isActive,
							$elm$html$Html$Attributes$class('dynamic-shape')),
							A2($elm$html$Html$Attributes$style, 'flex-basis', '5rem'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2(
							$author$project$Skeleton$attributeIf,
							!isActive,
							A2(
								$elm$html$Html$Events$on,
								'pointerdown',
								$author$project$Calendar$pointerDownDecoder(activity)))
						]),
					_List_fromArray(
						[
							$author$project$ActivityShape$view(activity)
						])),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('column expand'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2(
							$author$project$Skeleton$attributeIf,
							!isActive,
							A2(
								$elm$html$Html$Events$on,
								'pointerdown',
								$author$project$Calendar$pointerDownDecoder(activity)))
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$row,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(activity.ap)
								])),
							A2(
							$author$project$Skeleton$row,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.8rem')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Skeleton$column,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											function () {
												var _v0 = activity.T;
												switch (_v0.$) {
													case 0:
														var mins = _v0.a;
														var pace_ = _v0.b;
														return $elm$core$String$fromInt(mins) + (' min ' + $elm$core$String$toLower(
															$author$project$Activity$pace.bC(pace_)));
													case 1:
														var secs = _v0.a;
														var pace_ = _v0.b;
														return $elm$core$String$fromInt(secs) + (' secs ' + $elm$core$String$toLower(
															$author$project$Activity$pace.bC(pace_)));
													case 2:
														var mins = _v0.a;
														return $elm$core$String$fromInt(mins) + ' min ';
													case 3:
														var mins = _v0.a;
														return $elm$core$String$fromInt(mins) + ' min ';
													default:
														return '';
												}
											}())
										])),
									A2(
									$author$project$Skeleton$compactColumn,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'align-items', 'flex-end')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(level)
										]))
								]))
						])),
					A2(
					$author$project$Skeleton$compactColumn,
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$attributeIf,
							!isActive,
							A2(
								$elm$html$Html$Events$on,
								'pointerdown',
								$elm$json$Json$Decode$succeed(
									A2($author$project$Msg$SelectActivity, activity, true)))),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Skeleton$row,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '0.4rem'),
									A2($elm$html$Html$Attributes$style, 'height', '0.4rem'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
									A2($elm$html$Html$Attributes$style, 'border', '2px solid transparent'),
									A2(
									$author$project$Skeleton$attributeIf,
									isActiveDate || isActive,
									$author$project$Skeleton$borderStyle('border')),
									A2(
									$author$project$Skeleton$attributeIf,
									isActive,
									A2($elm$html$Html$Attributes$style, 'background-color', 'var(--icon-gray)'))
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$Msg$ClickedNewActivity = function (a) {
	return {$: 25, a: a};
};
var $author$project$Calendar$viewAddButton = function (date) {
	return A2(
		$author$project$Skeleton$row,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding', '0.5rem 0.5rem')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Skeleton$compactColumn,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Msg$ClickedNewActivity(date)),
								$elm$html$Html$Attributes$class('button small'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.8rem'),
								A2($elm$html$Html$Attributes$style, 'padding', '0.05rem 0.25rem'),
								A2($elm$html$Html$Attributes$style, 'color', 'var(--icon-gray)')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mi-add')
									]),
								_List_Nil)
							]))
					]))
			]));
};
var $author$project$Msg$MoveTo = function (a) {
	return {$: 8, a: a};
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $justinmimbs$date$Date$fromRataDie = function (rd) {
	return rd;
};
var $author$project$Calendar$viewDay = F3(
	function (isToday, isSelected, rataDie) {
		var date = $justinmimbs$date$Date$fromRataDie(rataDie);
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$attributeIf,
					$justinmimbs$date$Date$day(date) === 1,
					$elm$html$Html$Attributes$class('month-header')),
					A2(
					$author$project$Skeleton$attributeIf,
					isSelected,
					$elm$html$Html$Attributes$id('selected-date')),
					A2(
					$elm$html$Html$Attributes$attribute,
					'data-date',
					$justinmimbs$date$Date$toIsoString(date)),
					A2($elm$html$Html$Attributes$style, 'padding', '1rem 0.5rem'),
					A3($author$project$Skeleton$styleIf, isToday, 'font-weight', 'bold'),
					A2(
					$elm$html$Html$Events$on,
					'pointerenter',
					$elm$json$Json$Decode$succeed(
						$author$project$Msg$MoveTo(date)))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					A2($justinmimbs$date$Date$format, 'E MMM d', date))
				]));
	});
var $author$project$Calendar$daysOfWeek = function (start) {
	return A4(
		$justinmimbs$date$Date$range,
		11,
		1,
		start,
		A3($justinmimbs$date$Date$add, 2, 1, start));
};
var $author$project$Calendar$titleWeek = F2(
	function (start, _v0) {
		var runDuration = _v0.a;
		var otherDuration = _v0.b;
		var monthStart = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (d) {
					return $justinmimbs$date$Date$day(d) === 1;
				},
				$author$project$Calendar$daysOfWeek(start)));
		var minutes = function (duration) {
			return duration % 60;
		};
		var hours = function (duration) {
			return $elm$core$Basics$floor(duration / 60);
		};
		return A2(
			$author$project$Skeleton$column,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'min-width', '4rem')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$row,
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function (month) {
								return _List_fromArray(
									[
										$elm$html$Html$Attributes$class('month-header'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'data-date',
										$justinmimbs$date$Date$toIsoString(month))
									]);
							},
							monthStart)),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$Maybe$withDefault,
								'',
								A2(
									$elm$core$Maybe$map,
									$justinmimbs$date$Date$format('MMM'),
									monthStart)))
						])),
					A2(
					$author$project$Skeleton$row,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', 'var(--activity-green)')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							(!(!runDuration)) ? A3(
								$elm$core$List$foldr,
								$elm$core$Basics$append,
								'',
								_List_fromArray(
									[
										$elm$core$String$fromInt(
										hours(runDuration)),
										'h ',
										$elm$core$String$fromInt(
										minutes(runDuration)),
										'm'
									])) : '')
						])),
					A2(
					$author$project$Skeleton$row,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', 'var(--activity-gray)')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							(!(!otherDuration)) ? A3(
								$elm$core$List$foldr,
								$elm$core$Basics$append,
								'',
								_List_fromArray(
									[
										$elm$core$String$fromInt(
										hours(otherDuration)),
										'h ',
										$elm$core$String$fromInt(
										minutes(otherDuration)),
										'm'
									])) : '')
						]))
				]));
	});
var $author$project$Calendar$viewWeekDay = F4(
	function (_v0, isToday, isSelected, activeId) {
		var date = _v0.a;
		var activities = _v0.b;
		var pointerEvent = function (a) {
			return _Utils_eq(activeId, a.ay) ? $author$project$Msg$MoveActivity(a) : $author$project$Msg$EditActivity(a);
		};
		return A2(
			$author$project$Skeleton$column,
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$attributeIf,
					isSelected,
					$elm$html$Html$Attributes$id('selected-date')),
					A2($elm$html$Html$Attributes$style, 'min-height', '4rem'),
					A2($elm$html$Html$Attributes$style, 'padding-bottom', '1rem'),
					A2(
					$elm$html$Html$Events$on,
					'pointerenter',
					$elm$json$Json$Decode$succeed(
						$author$project$Msg$MoveTo(date)))
				]),
			A2(
				$elm$core$List$cons,
				A2(
					$author$project$Skeleton$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									A2(
										$author$project$Msg$ChangeZoom,
										1,
										$elm$core$Maybe$Just(date))),
									A2(
									$elm$html$Html$Attributes$attribute,
									'data-date',
									$justinmimbs$date$Date$toIsoString(date)),
									A3($author$project$Skeleton$styleIf, isToday, 'text-decoration', 'underline')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($justinmimbs$date$Date$format, 'd', date))
								]))
						])),
				A2(
					$elm$core$List$map,
					function (a) {
						return A2(
							$author$project$Skeleton$row,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Events$on,
									'pointerdown',
									$elm$json$Json$Decode$succeed(
										pointerEvent(a))),
									$elm$html$Html$Attributes$class('no-select'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.1rem'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '0.2rem'),
									A2(
									$author$project$Skeleton$attributeIf,
									_Utils_eq(a.ay, activeId),
									A2($elm$html$Html$Attributes$style, 'opacity', '0.5'))
								]),
							_List_fromArray(
								[
									$author$project$ActivityShape$view(a)
								]));
					},
					activities)));
	});
var $author$project$Calendar$viewWeek = F5(
	function (allActivities, today, selected, start, activeId) {
		var dayViews = A2(
			$elm$core$List$map,
			function (d) {
				return A4(
					$author$project$Calendar$viewWeekDay,
					_Utils_Tuple2(
						d,
						A2($author$project$Calendar$filterActivities, d, allActivities)),
					_Utils_eq(d, today),
					_Utils_eq(d, selected),
					activeId);
			},
			$author$project$Calendar$daysOfWeek(start));
		var activities = $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (d) {
					return A2($author$project$Calendar$filterActivities, d, allActivities);
				},
				$author$project$Calendar$daysOfWeek(start)));
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (_v2, _v3) {
					var r = _v2.a;
					var o = _v2.b;
					var sr = _v3.a;
					var so = _v3.b;
					return _Utils_Tuple2(sr + r, so + o);
				}),
			_Utils_Tuple2(0, 0),
			A2(
				$elm$core$List$map,
				function (a) {
					var _v1 = a.T;
					switch (_v1.$) {
						case 0:
							var mins = _v1.a;
							return _Utils_Tuple2(mins, 0);
						case 2:
							var mins = _v1.a;
							return _Utils_Tuple2(mins, 0);
						case 3:
							var mins = _v1.a;
							return _Utils_Tuple2(0, mins);
						default:
							return _Utils_Tuple2(0, 0);
					}
				},
				activities));
		var runDuration = _v0.a;
		var otherDuration = _v0.b;
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'padding', '0 0.5rem')
				]),
			A2(
				$elm$core$List$cons,
				A2(
					$author$project$Calendar$titleWeek,
					start,
					_Utils_Tuple2(runDuration, otherDuration)),
				dayViews));
	});
var $justinmimbs$date$Date$Week = 3;
var $author$project$Calendar$weekList = F2(
	function (start, end) {
		return A4(
			$justinmimbs$date$Date$range,
			3,
			1,
			A2($justinmimbs$date$Date$floor, 3, start),
			end);
	});
var $author$project$Calendar$view = F4(
	function (model, activities, activeId, activeRataDie) {
		var _v0 = model;
		var zoom = _v0.a;
		var start = _v0.b;
		var end = _v0.c;
		var selected = _v0.d;
		var today = _v0.e;
		var scrollCompleted = _v0.f;
		var dayRows = function (date) {
			return $elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							_Utils_Tuple2(
							$justinmimbs$date$Date$toIsoString(date),
							A4(
								$elm$html$Html$Lazy$lazy3,
								$author$project$Calendar$viewDay,
								_Utils_eq(date, today),
								_Utils_eq(date, selected),
								$justinmimbs$date$Date$toRataDie(date)))
						]),
						A2(
						$elm$core$List$map,
						function (activity) {
							return _Utils_Tuple2(
								activity.ay,
								A4(
									$elm$html$Html$Lazy$lazy3,
									$author$project$Calendar$viewActivity,
									A2($elm$core$String$contains, activity.ay, activeId),
									_Utils_eq(
										$justinmimbs$date$Date$toRataDie(date),
										activeRataDie),
									activity));
						},
						A2($author$project$Calendar$filterActivities, date, activities)),
						_List_fromArray(
						[
							_Utils_Tuple2(
							$justinmimbs$date$Date$toIsoString(date) + '+',
							A2($elm$html$Html$Lazy$lazy, $author$project$Calendar$viewAddButton, date))
						])
					]));
		};
		var body = function () {
			switch (zoom) {
				case 0:
					return A2(
						$elm$core$List$map,
						function (d) {
							return _Utils_Tuple2(
								$justinmimbs$date$Date$toIsoString(d),
								A6($elm$html$Html$Lazy$lazy5, $author$project$Calendar$viewWeek, activities, today, selected, d, activeId));
						},
						A2($author$project$Calendar$weekList, start, end));
				case 1:
					return A2(
						$elm$core$List$concatMap,
						dayRows,
						A2($author$project$Calendar$listDays, start, end));
				default:
					return dayRows(selected);
			}
		}();
		var loadingSpinner = A2(
			$author$project$Skeleton$viewIf,
			zoom !== 2,
			A2(
				$author$project$Skeleton$row,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
						A2($elm$html$Html$Attributes$style, 'padding', '1rem')
					]),
				_List_fromArray(
					[
						$author$project$Skeleton$spinner('2rem')
					])));
		return A2(
			$author$project$Skeleton$expandingRow,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'overflow', 'hidden')
				]),
			_List_fromArray(
				[
					A3(
					$elm$html$Html$Keyed$node,
					'div',
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('calendar'),
							$elm$html$Html$Attributes$class('column expand'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'scroll'),
							A2($elm$html$Html$Attributes$style, 'overflow-x', 'hidden'),
							A2(
							$author$project$Skeleton$attributeIf,
							scrollCompleted,
							$author$project$Calendar$onScroll(
								$author$project$Calendar$scrollHandler(model))),
							$elm$html$Html$Attributes$class('no-select'),
							A3($author$project$Skeleton$styleIf, !zoom, 'animation', 'slidein-left 0.5s'),
							A3($author$project$Skeleton$styleIf, zoom === 1, 'animation', 'slidein-right 0.5s 0.01ms'),
							A3($author$project$Skeleton$styleIf, zoom === 1, 'opacity', '0'),
							A3($author$project$Skeleton$styleIf, zoom === 1, 'animation-fill-mode', 'forwards')
						]),
					$elm$core$List$concat(
						_List_fromArray(
							[
								_List_fromArray(
								[
									_Utils_Tuple2('loadingup', loadingSpinner)
								]),
								body,
								_List_fromArray(
								[
									_Utils_Tuple2('loadingdown', loadingSpinner)
								])
							])))
				]));
	});
var $author$project$Main$viewActivityM = function (activityState) {
	if (activityState.$ === 2) {
		var activity = activityState.a;
		var x = activityState.b;
		var y = activityState.c;
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(x) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromFloat(y) + 'px'),
					A2($elm$html$Html$Attributes$style, 'z-index', '3')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$compactColumn,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex-basis', '5rem')
						]),
					_List_fromArray(
						[
							$author$project$ActivityShape$view(activity)
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Calendar$viewHeader = function (model) {
	return A2(
		$author$project$Skeleton$viewIf,
		!$author$project$Calendar$get(model).a4,
		A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					$author$project$Skeleton$borderStyle('border-bottom')
				]),
			A2(
				$elm$core$List$cons,
				A2(
					$author$project$Skeleton$column,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'min-width', '4rem')
						]),
					_List_Nil),
				A2(
					$elm$core$List$map,
					function (d) {
						return A2(
							$author$project$Skeleton$column,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', 'white'),
									A2($elm$html$Html$Attributes$style, 'color', 'var(--icon-gray)')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(d)
								]));
					},
					_List_fromArray(
						['M', 'T', 'W', 'T', 'F', 'S', 'S'])))));
};
var $author$project$Main$view = function (model) {
	return A2(
		$author$project$Skeleton$expandingRow,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('home'),
				$author$project$Skeleton$borderStyle('border-left'),
				$author$project$Skeleton$borderStyle('border-right')
			]),
		_List_fromArray(
			[
				function () {
				switch (model.$) {
					case 0:
						if (model.a.$ === 1) {
							var _v1 = model.a;
							return A2(
								$author$project$Skeleton$column,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Loading')
									]));
						} else {
							var date = model.a.a;
							return A2(
								$author$project$Skeleton$column,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$author$project$Skeleton$row,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('center')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Examples')
											])),
										A2(
										$author$project$Skeleton$row,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('button'),
														$elm$html$Html$Events$onClick(
														$author$project$Msg$LoadExampleActivities(_List_Nil))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Blank')
													]))
											]))
									]));
						}
					case 2:
						var errorString = model.a;
						return A2(
							$author$project$Skeleton$column,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(errorString)
								]));
					default:
						var _v2 = model.a;
						var calendar = _v2.a;
						var store = _v2.b;
						var activityM = _v2.c;
						var events = function () {
							if (activityM.$ === 2) {
								return _List_fromArray(
									[
										A2($elm$html$Html$Events$on, 'pointermove', $author$project$Main$mouseMoveDecoder),
										A2(
										$elm$html$Html$Events$on,
										'pointerup',
										$elm$json$Json$Decode$succeed($author$project$Msg$MouseReleased)),
										A2($elm$html$Html$Attributes$style, 'touch-action', 'none'),
										A2($elm$html$Html$Attributes$style, 'pointer-action', 'none')
									]);
							} else {
								return _List_Nil;
							}
						}();
						var activities = A2(
							$author$project$Store$get,
							store,
							function ($) {
								return $.ai;
							});
						var levelM = $author$project$Main$calculateLevel(activities);
						var activeRataDie = function () {
							_v4$2:
							while (true) {
								switch (activityM.$) {
									case 1:
										var date = activityM.a.an;
										return A2(
											$elm$core$Maybe$withDefault,
											0,
											A2($elm$core$Maybe$map, $justinmimbs$date$Date$toRataDie, date));
									case 0:
										if (activityM.a.b) {
											var _v5 = activityM.a;
											var a = _v5.a;
											return $justinmimbs$date$Date$toRataDie(a.an);
										} else {
											break _v4$2;
										}
									default:
										break _v4$2;
								}
							}
							return 0;
						}();
						var activeId = function () {
							switch (activityM.$) {
								case 0:
									var list = activityM.a;
									return A2(
										$elm$core$String$join,
										' ',
										A2(
											$elm$core$List$map,
											function ($) {
												return $.ay;
											},
											list));
								case 1:
									var id = activityM.a.ay;
									return id;
								case 2:
									var id = activityM.a.ay;
									return id;
								default:
									return '';
							}
						}();
						return A2(
							$author$project$Skeleton$column,
							A2(
								$elm$core$List$cons,
								A2($elm$html$Html$Attributes$style, 'position', 'relative'),
								events),
							_List_fromArray(
								[
									A2($elm$html$Html$Lazy$lazy, $author$project$Calendar$viewHeader, calendar),
									A5($elm$html$Html$Lazy$lazy4, $author$project$Calendar$view, calendar, activities, activeId, activeRataDie),
									A2($elm$html$Html$Lazy$lazy, $author$project$Main$viewActivityM, activityM),
									A3($elm$html$Html$Lazy$lazy2, $author$project$ActivityForm$view, levelM, activityM)
								]));
				}
			}()
			]));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Skeleton$logo = A2(
	$elm$html$Html$img,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'height', '2rem'),
			$elm$html$Html$Attributes$src('icon.svg')
		]),
	_List_Nil);
var $author$project$Calendar$viewBackButton = function (model) {
	var _v0 = model;
	var zoom = _v0.a;
	var start = _v0.b;
	var end = _v0.c;
	var selected = _v0.d;
	var today = _v0.e;
	var scrollCompleted = _v0.f;
	switch (zoom) {
		case 0:
			return $author$project$Skeleton$logo;
		case 1:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('button'),
						A2($elm$html$Html$Attributes$style, 'margin-right', '0.2rem'),
						$elm$html$Html$Events$onClick(
						A2($author$project$Msg$ChangeZoom, 0, $elm$core$Maybe$Nothing))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mi-chevron-left')
							]),
						_List_Nil),
						$elm$html$Html$text(
						A2($justinmimbs$date$Date$format, 'yyyy', selected))
					]));
		default:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('button'),
						A2($elm$html$Html$Attributes$style, 'margin-right', '0.2rem'),
						$elm$html$Html$Events$onClick(
						A2($author$project$Msg$ChangeZoom, 1, $elm$core$Maybe$Nothing))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mi-chevron-left')
							]),
						_List_Nil),
						$elm$html$Html$text(
						A2($justinmimbs$date$Date$format, 'MMMM yyyy', selected))
					]));
	}
};
var $justinmimbs$date$Date$Month = 2;
var $author$project$Calendar$viewDropdownItem = F3(
	function (changeDate, formatDate, date) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					changeDate(date))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					A2($justinmimbs$date$Date$format, formatDate, date))
				]));
	});
var $author$project$Calendar$listMonths = F2(
	function (date, changeDate) {
		var start = A3(
			$justinmimbs$date$Date$fromCalendarDate,
			$justinmimbs$date$Date$year(date),
			0,
			1);
		var end = A3(
			$justinmimbs$date$Date$fromCalendarDate,
			$justinmimbs$date$Date$year(
				A3($justinmimbs$date$Date$add, 0, 1, date)),
			0,
			1);
		return A2(
			$elm$core$List$map,
			A2($author$project$Calendar$viewDropdownItem, changeDate, 'MMMM'),
			A4($justinmimbs$date$Date$range, 2, 1, start, end));
	});
var $author$project$Calendar$listYears = F2(
	function (date, changeDate) {
		var middle = A3(
			$justinmimbs$date$Date$fromCalendarDate,
			2019,
			$justinmimbs$date$Date$month(date),
			1);
		var start = A3($justinmimbs$date$Date$add, 0, -3, middle);
		var end = A3($justinmimbs$date$Date$add, 0, 3, middle);
		return A2(
			$elm$core$List$map,
			A2($author$project$Calendar$viewDropdownItem, changeDate, 'yyyy'),
			A4($justinmimbs$date$Date$range, 2, 12, start, end));
	});
var $author$project$Calendar$viewDatePicker = function (model) {
	var _v0 = model;
	var zoom = _v0.a;
	var start = _v0.b;
	var end = _v0.c;
	var selected = _v0.d;
	var today = _v0.e;
	var scrollCompleted = _v0.f;
	switch (zoom) {
		case 0:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($justinmimbs$date$Date$format, 'yyyy', selected))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dropdown-content')
							]),
						A2($author$project$Calendar$listYears, selected, $author$project$Msg$Jump))
					]));
		case 1:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($justinmimbs$date$Date$format, 'MMMM', selected))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dropdown-content')
							]),
						A2($author$project$Calendar$listMonths, selected, $author$project$Msg$Jump))
					]));
		default:
			return $elm$html$Html$text('');
	}
};
var $author$project$Calendar$viewMenu = function (model) {
	var _v0 = model;
	var zoom = _v0.a;
	var start = _v0.b;
	var end = _v0.c;
	var selected = _v0.d;
	var today = _v0.e;
	var scrollCompleted = _v0.f;
	return A2(
		$author$project$Skeleton$row,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Skeleton$compactColumn,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
					]),
				_List_fromArray(
					[
						$author$project$Calendar$viewBackButton(model)
					])),
				A2(
				$author$project$Skeleton$column,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Skeleton$row,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
							]),
						_List_fromArray(
							[
								$author$project$Calendar$viewDatePicker(model),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-left', '0.2rem'),
										$elm$html$Html$Events$onClick(
										$author$project$Msg$Jump(today))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Today')
									]))
							]))
					]))
			]));
};
var $author$project$Main$viewNavbar = function (model) {
	if (model.$ === 1) {
		var _v1 = model.a;
		var calendar = _v1.a;
		var store = _v1.b;
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'padding', '0.5rem')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$column,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Calendar$viewMenu(calendar)
						]))
				]));
	} else {
		return A2(
			$author$project$Skeleton$row,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'padding', '0.5rem')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Skeleton$compactColumn,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
						]),
					_List_fromArray(
						[$author$project$Skeleton$logo]))
				]));
	}
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{
		bh: $author$project$Main$init,
		bz: $author$project$Main$subscriptions,
		bE: $author$project$Main$update,
		bF: function (model) {
			return {
				a7: _List_fromArray(
					[
						A2(
						$author$project$Skeleton$layout,
						$author$project$Main$viewNavbar(model),
						$author$project$Main$view(model))
					]),
				bB: 'Rhino Log'
			};
		}
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));