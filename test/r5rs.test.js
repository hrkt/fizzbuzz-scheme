// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-2.html#%_toc_start

'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { jest } from '@jest/globals'
import { FsDefinedProcedure } from '../src/sexp.js'
import { FsException } from '../src/common.js'

// 1. Overview of scheme

// all cleared 😊
test('✅1.3.4', () => {
  const code = '(* 5 8)'
  expect(new FBS().eval(code).toString()).toBe(40)
})

// all cleared 😊
test('✅2.2', () => {
  const code = `;;; The FACT procedure computes the factorial
  ;;; of a non-negative integer.
  (define fact
    (lambda (n)
      (if (= n 0)
          1        ;Base case: return 1
          (* n (fact (- n 1))))))
  (fact 10)
  `

  expect(new FBS().eval(code).toString()).toBe(3628800)
})

// 2. Lexical conventions

// 3. Basic concepts

// 4. Expressions

// all cleared 😊
test('✅4.1.1', () => {
  const fbs = new FBS()
  fbs.eval('(define x 28)')
  expect(fbs.eval('x').toString()).toBe(28)
})

test('🚧4.1.2', () => {
  expect(new FBS().eval('(quote a)').toString()).toBe('a')

  // TODO:
  // expect(new FBS().eval('(quote #(a b c))','#(a b c)')

  expect(new FBS().eval('(quote (+ 1 2))').toString()).toBe('(+ 1 2)')
})

// all cleared 😊
test('✅4.1.3', () => {
  expect(new FBS().eval('(+ 3 4)').toString()).toBe(7)
  expect(new FBS().eval('((if #f + *) 3 4)').toString()).toBe(12)
})

test('🚧4.1.4', () => {
  const fbs = new FBS()
  expect(fbs.eval('(lambda (x) (+ x x))') instanceof FsDefinedProcedure).toBe(true)

  expect(new FBS().eval('((lambda (x) (+ x x)) 4)').toString()).toBe(8)

  {
    const code = `(define reverse-subtract
      (lambda (x y) (- y x)))
    (reverse-subtract 7 10)
    `
    expect(new FBS().eval(code).toString()).toBe(3)
  }

  {
    const code = `(define add4
      (let ((x 4))
        (lambda (y) (+ x y))))
    (add4 6)
    `
    expect(new FBS().eval(code).toString()).toBe(10)
  }

  expect(new FBS().eval('((lambda x x) 3 4 5 6)').toString()).toBe('(3 4 5 6)')

  // TODO: after adding dot-pair
  // expect(new FBS().eval('((lambda (x y . z) z) 3 4 5 6)').toString()).toBe('(5 6)')
})

// all cleared 😊
test('✅4.1.5', () => {
  expect(new FBS().eval('(if (> 3 2) \'yes \'no)').toString()).toBe('yes')
  expect(new FBS().eval('(if (> 2 3) \'yes \'no)').toString()).toBe('no')
  {
    const code = `(if (> 3 2)
    (- 3 2)
    (+ 3 2))
    `
    expect(new FBS().eval(code).toString()).toBe(1)
  }
})

// all cleared 😊
test('✅4.1.6', () => {
  const fbs = new FBS()
  fbs.eval('(define x 2)')
  expect(fbs.eval('(+ x 1)').toString()).toBe(3)
  fbs.eval('(set! x 4)') // unspecified
  expect(fbs.eval('(+ x 1)').toString()).toBe(5)
})

test('🚧4.2.2', () => {
  expect(new FBS().eval('(let ((x 2) (y 3)) (* x y))').toString()).toBe(6)
})

// all cleared 😊
test('✅4.2.3_1', () => {
  const code = `
  (define x 0)
  (begin (set! x 5)
       (+ x 1))
  `
  expect(new FBS().eval(code).toString()).toBe(6)
})

// all cleared 😊
test('✅4.2.3_2', () => {
  const code = `
  (begin (display "4 plus 1 equals ")
  (display (+ 4 1)))
  `

  const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
  const fbs = new FBS()
  fbs.eval(code)
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(1, '4 plus 1 equals ')
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(2, '5')
  mockStdoutWrite.mockRestore()
})

// 5. Program structure

// 6. Standard procedures

// (eq? "" "")                             ===>  unspecified
// (eq? '() '())                           ===>  #t
// (eq? 2 2)                               ===>  unspecified
// (eq? #\A #\A)         ===>  unspecified
// (eq? car car)                           ===>  #t
// (let ((n (+ 2 3)))
//   (eq? n n))              ===>  unspecified
// (let ((x '(a)))
//   (eq? x x))              ===>  #t
// (let ((x '#()))
//   (eq? x x))              ===>  #t
// (let ((p (lambda (x) x)))
//   (eq? p p))              ===>  #t

// procedure (eq? block
// all cleared 😊
test('✅6.1_2', () => {
  // eq? checks 2 objects point the same point of memory
  expect(new FBS().eval('(eq? \'a \'a)').toString()).toBe('#t')
  expect(new FBS().eval('(eq? \'(a) \'(a))').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? (list \'a) (list \'a))').toString()).toBe('#f')
  expect(new FBS().eval('(eq? "a" "a")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? "" "")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? \'() \'())').toString()).toBe('#t')
  expect(new FBS().eval('(eq? 2 2)').toString()).toBe('#t') // unspecified
  expect(new FBS().eval('(eq? #\\A #\\A)').toString()).toBe('#t')// unspecified
  expect(new FBS().eval('(eq? car car)').toString()).toBe('#t')
  expect(new FBS().eval('(let ((n (+ 2 3))) (eq? n n)) ').toString()).toBe('#t') // unspecified
  expect(new FBS().eval('(let ((x \'(a))) (eq? x x))').toString()).toBe('#t')
  expect(new FBS().eval('(let ((x \'#())) (eq? x x))').toString()).toBe('#t')
  expect(new FBS().eval('(let ((p (lambda (x) x))) (eq? p p))').toString()).toBe('#t')
})

test('🚧6.1_3', () => {
  expect(new FBS().eval('(equal? \'a \'a) ').toString()).toBe('#t')
  expect(new FBS().eval('(equal? \'(a) \'(a)) ').toString()).toBe('#t')
  expect(new FBS().eval('(equal? \'(a (b) c) \'(a (b) c))').toString()).toBe('#t')
  expect(new FBS().eval('(equal? "abc" "abc")').toString()).toBe('#t')
  expect(new FBS().eval('(equal? 2 2)').toString()).toBe('#t')
  // TODO: after adding make-vector
  // expect(new FBS().eval('(equal? (make-vector 5 \'a) (make-vector 5 \'a))').toString()).toBe('#t')
  expect(new FBS().eval('(equal? (lambda (x) x) (lambda (y) y))').toString()).toBe('#f') // unspecified
})

// test('🚧..', () => {
//   expect(new FBS().eval('').toString()).toBe('')
// })

test('🚧6.2.5', () => {
  expect(new FBS().eval('(+ 3 4)').toString()).toBe(7)
  expect(new FBS().eval('(+)').toString()).toBe(0)
  expect(new FBS().eval('(* 4)').toString()).toBe(4)
  expect(new FBS().eval('(*)').toString()).toBe(1)
})

// all cleared 😊
test('✅6.3.1', () => {
  expect(new FBS().eval('#t').toString()).toBe('#t')
  expect(new FBS().eval('#f').toString()).toBe('#f')
  expect(new FBS().eval('\'#f').toString()).toBe('#f')

  // library procedure not
  expect(new FBS().eval('(not #t)').toString()).toBe('#f')
  expect(new FBS().eval('(not 3)').toString()).toBe('#f')
  expect(new FBS().eval('(not (list 3))').toString()).toBe('#f')
  expect(new FBS().eval('(not #f)').toString()).toBe('#t')
  expect(new FBS().eval('(not \'())').toString()).toBe('#f')
  expect(new FBS().eval('(not (list))').toString()).toBe('#f')
  expect(new FBS().eval('(not \'nil)').toString()).toBe('#f')
  expect(new FBS().eval('\'#f').toString()).toBe('#f')

  // library procedure boolean?
  expect(new FBS().eval('(boolean? #f)').toString()).toBe('#t')
  expect(new FBS().eval('(boolean? 0)').toString()).toBe('#f')
  expect(new FBS().eval('(boolean? \'())').toString()).toBe('#f')
})

test('🚧6.3.2_1', () => {
  const fbs = new FBS()
  fbs.eval('(define x (list \'a \'b \'c))')
  fbs.eval('(define y x)')

  expect(fbs.eval('y').toString()).toBe('(a b c)')
  expect(fbs.eval('(list? y)').toString()).toBe('#t')
  fbs.eval('(set-cdr! x 4)') // unspecified
  expect(fbs.eval('x').toString()).toBe('(a . 4)')
  // expect(fbs.eval('(eqv? x y)').toString()).toBe('#t') // TODO: after (eqv?)
})

test('✅6.3.2_2', () => {
  expect(new FBS().eval('(pair? \'(a . b))').toString()).toBe('#t')
  expect(new FBS().eval('(pair? \'(a b c))').toString()).toBe('#t')
  expect(new FBS().eval('(pair? \'())').toString()).toBe('#f')
  expect(new FBS().eval('(pair? \'#(a b))').toString()).toBe('#f')

  expect(new FBS().eval('(cons \'a \'())').toString()).toBe('(a)')
  expect(new FBS().eval('(cons \'(a) \'(b c d))').toString()).toBe('((a) b c d)')
  expect(new FBS().eval('(cons "a" \'(b c))').toString()).toBe('("a" b c)')
  expect(new FBS().eval('(cons \'a 3)').toString()).toBe('(a . 3)')
  expect(new FBS().eval('(cons \'(a b) \'c)').toString()).toBe('((a b) . c)')
})

test('🚧6.3.2_3', () => {
  expect(new FBS().eval('(cons \'a \'())').toString()).toBe('(a)')
  expect(new FBS().eval('(cons \'(a) \'(b c d))').toString()).toBe('((a) b c d)')
  expect(new FBS().eval('(cons "a" \'(b c))').toString()).toBe('("a" b c)')
  expect(new FBS().eval('(cons \'a 3)').toString()).toBe('(a . 3)')
  expect(new FBS().eval('(cons \'(a b) \'c)').toString()).toBe('((a b) . c)')

  expect(new FBS().eval('(car \'(a b c))').toString()).toBe('a')
  expect(new FBS().eval('(car \'((a) b c d))').toString()).toBe('(a)')
  expect(new FBS().eval('(car \'(1 . 2))').toString()).toBe(1)
  expect(() => { new FBS().eval('car \'())') }).toThrow(FsException)
})

test('🚧6.3.2_4', () => {
  expect(new FBS().eval('(append \'(x) \'(y))').toString()).toBe('(x y)')
  expect(new FBS().eval('(append \'(a) \'(b c d))').toString()).toBe('(a b c d)')
  expect(new FBS().eval('(append \'(a (b)) \'((c)))').toString()).toBe('(a (b) (c))')
})

test('🚧6.3.3', () => {
  expect(new FBS().eval('(symbol? \'foo)').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? (car \'(a b))) ').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? "bar")').toString()).toBe('#f')
  expect(new FBS().eval('(symbol? \'nil)').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? \'())').toString()).toBe('#f')
  expect(new FBS().eval('(symbol? #f)').toString()).toBe('#f')
})

test('🚧6.3.6', () => {
  expect(new FBS().eval('(vector \'a \'b \'c)').toString()).toBe('#(a b c)')
})

// 7. Format Syntax and semantics

// Example
