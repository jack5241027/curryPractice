// var curry = require('lodash').curry;
var _ = require('ramda');

function getParamNamesLength(func) {
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if(result === null){
		result = [];
	}
	return result.length;
}
/*
* @ Curry化 -> 接受 函式一部分的參數，得到新的函式
* @ 利用Curry，我們能夠做到讓每個函數都先接收數據，然後操作數據，最後再把數據傳遞到下一個函數那裡去。
*/
var curry = function(fn){
	//初次curry化
	return function(){
		var arg = Array.prototype.slice.call(arguments);
		if(arg.length>1){
			//丟進第一個參數，參數超過一個時。
			return fn.apply(this,arg.concat(Array.prototype.slice.call(arguments)));
		}else{
			//丟進第一個參數，第一次執行。
			return function(){
				if(getParamNamesLength(fn) > 2){
					var args = arg.concat(Array.prototype.slice.call(arguments));
					return function(){
						return fn.apply(this,args.concat(Array.prototype.slice.call(arguments)));
					}
				}else{
					//丟進第二個參數，回傳執行結果。
					return fn.apply(this,arg.concat(Array.prototype.slice.call(arguments)));
				}
			}
		}
	}
}

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(fun, ary) {
  return ary.filter(fun);
});

var map = curry(function(fun, ary) {
  return ary.map(fun);
});


console.log(match(/\s+/g, "hello world"));
// [ ' ' ]
console.log(match(/\s+/g)("hello world"));
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }
console.log(hasSpaces("hello world"));
// [ ' ' ]
console.log(hasSpaces("spaceless"));
// null


console.log(filter(hasSpaces, ["tori_spelling", "tori amos"]));
// ["tori amos"]
var findSpaces = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }
console.log(findSpaces(["tori_spelling", "tori amos"]));
// ["tori amos"]


var noVowels = replace(/[aeiou]/ig);
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }
var censored = noVowels("*");
// function(x) { return x.replace(/[aeiou]/ig, "*") }
console.log(censored("Chocolate Rain"));

// var split = function(target){
// 	return function(str){
// 		return str.split(target);
// 	}
// }
var split = curry(function(target,str){
	return str.split(target);
});

var words = split(' ');

var sentences = map(words);

var filterQs = filter(match(/q/i));

var _keepHighest = function(x,y) {return x >= y ? x : y; };

var max = curry(function(xs,ary){
	return ary.reduce(_keepHighest,-Infinity,xs);
})(0);

module.exports = { 
					words: words,
					sentences:sentences,
					filterQs:filterQs,
					max:max
                 };


