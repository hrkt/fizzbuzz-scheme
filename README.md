# FizzBuzz Scheme

A tiny scheme subset interpreter that can evaluate fizz-buzz code.

# capability

It runs the 'Fizz-Buzz' program written in this scheme-subset.

## target

This interpreter runs code like below(hand-formatted).

```
(define fb
	(lambda (x) 
		(if 
			(and (= (mod x 3) 0) (= (mod x 5) 0))
			(quote fizzbuzz)
			(if
				(= (mod x 3) 0)
				(quote fizz)
				(if
					(= (mod x 5) 0)
					(quote buzz)
					x
				)
			)
		)
	)
)
```

The code this interpreter runs now is in sample/fizzbuzz.fbs .

## results

```console
> npm run repl

fbs>sample
read:(define fb (lambda (x) (if (and (= (mod x 3) 0) (= (mod x 5) 0)) (quote fizzbuzz) (if (= (mod x 3) 0) (quote fizz) (if (= (mod x 5) 0) (quote buzz) x )))))

fbs>(fb 1)
1
fbs>(fb 3)
arg.length = 1
fizz
fbs>(fb 5)
arg.length = 1
buzz
fbs>(fb 15)
arg.length = 1
fizzbuzz
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
- ✅define [Assignments](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6)(with 1 variable, not closure)
- ✅basic arithmetic operators (+,-,*,/,mod) within basic accuracy of JavaScript.
- ✅basic comparison operators (=,<,<=,>,>=)
- ✅basic operators for FizzBuzz (and)
- ✅IF -> [Conditionals](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.5)
- ✅lambda -> [Procedures](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.4)
- ✅[Procedure calls](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.3)

## not implemented

- ❌ set! [Assignments](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.3)
- ❌ [sequencing](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.3)
- ❌ [quasiquotation](https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.2.6)

## Future work

- implementing items listed in "not implemented"

## LICENSE

### App
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
