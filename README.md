# FizzBuzz Scheme

A tiny scheme subset interpreter that can evaluate fizz-buzz code.

# capability

It runs the 'Fizz-Buzz' program written in this scheme-subset.

## target

This interpreter runs code like below(hand-formatted).

```
(define (fb x)
	(if
		(and (= (mod x 3) 0) (= (mod x 5) 0))
		"fizzbuzz"
		(if
			(= (mod x 3) 0)
			"fizz"
			(if
				(= (mod x 5) 0)
				"buzz"
				x
			)
		)
	)
)
(define (fizzbuzz x) (display (fb x)))
```

The code this interpreter runs now is in sample/fizzbuzz.fbs .

## results

```console
> npm run repl

fbs> (display "aaa")
aaa#undefined
fbs> samples
fbs> (fizzbuzz 2)
2#undefined
fbs> (fizzbuzz 3)
fizz#undefined
fbs> (fizzbuzz 4)
4#undefined
fbs> (fizzbuzz 5)
buzz#undefined
fbs> (fizzbuzz 15)
fizzbuzz#undefined
```

# how-to

## run REPL

```bash
$ npm run repl
```

## run test (Jest)

```bash
$ npm test
```

## run test UI (Majestic)

```bash
$ npm run majestic
```

## Implementation chart

### (at-most partly) implemented

- ✅[Variable references](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.1)
- ✅constants and quote[Literal expressions](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.2)
- ✅define [Assignments](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6)
- ✅set! [Assignments](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.3)
- ✅basic arithmetic operators (+,-,*,/,mod,exp,round) within basic accuracy of JavaScript.
- ✅basic comparison operators (=,<,<=,>,>=)
- ✅a basic operator for FizzBuzz (and)
- ✅other basic operators (not)
- ✅if -> [Conditionals](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.5)
- ✅lambda, [Procedure calls](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.3)
- ✅[sequencing](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.3)
- ✅(partly)[Proper tail recursion](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-6.html#%_sec_3.5)
- ✅some predicates for type-checking (boolean?, null?, number?, procedure?, symbol?)
- ✅[quasiquotation](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.6)

Test cases for a few part of R5RS are in [r5rs.test.js](test/r5rs.test.js)

## not implemented yet

_many_ feachers like ...

- ❌numbers : Rational, Complex, Integer, and its extactness 
- ❌[macro](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.3)
- ❌call with current continuation
- ❌ports other than CLI

## Fizz-Buzz Scheme original procedures

- some procedures benchmarking (peek-memory-usage)
## Future work

- implementing items listed in "not implemented"

## LICENSE

MIT

## CI

![GitHub Actions](https://github.com/hrkt/fizzbuzz-scheme/actions/workflows/node.js.yml/badge.svg)

## Appendix

### Scheme

- [ Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sites/default/files/sicp/index.html)
- [(How to Write a (Lisp) Interpreter (in Python))](http://norvig.com/lispy.html)

### Testing

- This repository use [Jest](https://jestjs.io/).
- Also use [Majestic](https://github.com/Raathigesh/majestic) for Jest UI.
- Cross-checking by running code in [Gauche](http://practical-scheme.net/gauche/) scheme interpreter. 
