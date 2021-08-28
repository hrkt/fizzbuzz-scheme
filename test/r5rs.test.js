// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-2.html#%_toc_start

'use strict'

import { FizzBuzzScheme } from '../src/index.js'
import { jest } from '@jest/globals'
import { FsProcedure } from '../src/sexp.js'

function myexpect (code, expectedStr, fbs = new FizzBuzzScheme()) {
  expect(fbs.eval(code).toString()).toBe(expectedStr)
}

// all cleared 😊
test('1.3.4', () => {
  const code = '(* 5 8)'
  myexpect(code, 40)
})

// all cleared 😊
test('2.2', () => {
  const code = `;;; The FACT procedure computes the factorial
  ;;; of a non-negative integer.
  (define fact
    (lambda (n)
      (if (= n 0)
          1        ;Base case: return 1
          (* n (fact (- n 1))))))
  (fact 10)
  `

  myexpect(code, 3628800)
})

// all cleared 😊
test('4.1.1', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define x 28)')
  myexpect('x', 28, fbs)
})

test('4.1.2', () => {
  myexpect('(quote a)', 'a')

  // TODO:
  // myexpect('(quote #(a b c))','#(a b c)')

  myexpect('(quote (+ 1 2))', '(+ 1 2)')
})

// all cleared 😊
test('4.1.3', () => {
  myexpect('(+ 3 4)', 7)
  myexpect('((if #f + *) 3 4)', 12)
})

test('4.1.4', () => {
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval('(lambda (x) (+ x x))') instanceof FsProcedure).toBe(true)

  myexpect('((lambda (x) (+ x x)) 4)', 8)

  {
    const code = `(define reverse-subtract
      (lambda (x y) (- y x)))
    (reverse-subtract 7 10)
    `
    myexpect(code, 3)
  }

  {
    const code = `(define add4
      (let ((x 4))
        (lambda (y) (+ x y))))
    (add4 6)
    `
    myexpect(code, 10)
  }

  myexpect('((lambda x x) 3 4 5 6)', '(3 4 5 6)')

  // TODO: after adding dot-pair
  // myexpect('((lambda (x y . z) z) 3 4 5 6)', '(5 6)')
})

// all cleared 😊
test('4.1.5', () => {
  myexpect('(if (> 3 2) \'yes \'no)', 'yes')
  myexpect('(if (> 2 3) \'yes \'no)', 'no')
  {
    const code = `(if (> 3 2)
    (- 3 2)
    (+ 3 2))
    `
    myexpect(code, 1)
  }
})

// all cleared 😊
test('4.1.6', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define x 2)')
  myexpect('(+ x 1)', 3, fbs)
  fbs.eval('(set! x 4)')
  myexpect('(+ x 1)', 5, fbs)
})

test('4.2.2', () => {
  myexpect('(let ((x 2) (y 3)) (* x y))', 6)
})

test('4.2.3_1', () => {
  const code = `
  (define x 0)
  (begin (set! x 5)
       (+ x 1))
  `
  myexpect(code, 6)
})

test('4.2.3_2', () => {
  const code = `
  (begin (display "4 plus 1 equals ")
  (display (+ 4 1)))
  `

  const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(1, '4 plus 1 equals ')
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(2, '5')
  mockStdoutWrite.mockRestore()
})

test('6.1', () => {
  myexpect('(equal? \'a \'a) ', '#t')
  myexpect('(equal? \'(a) \'(a)) ', '#t')
  myexpect('(equal? \'(a (b) c) \'(a (b) c))', '#t')
  myexpect('(equal? "abc" "abc")', '#t')
  myexpect('(equal? 2 2)', '#t')
  // TODO: after adding make-vector
  // myexpect('(equal? (make-vector 5 \'a) (make-vector 5 \'a))', '#t')
  myexpect('(equal? (lambda (x) x) (lambda (y) y))', '#f') // unspecified
})

// all cleared 😊
test('6.3.1', () => {
  myexpect('#t', '#t')
  myexpect('#f', '#f')
  myexpect('\'#f', '#f')

  myexpect('(not #t)', '#f')
  myexpect('(not 3)', '#f')
  myexpect('(not (list 3))', '#f')
  myexpect('(not #f)', '#t')
  myexpect('(not \'())', '#f')
  myexpect('(not (list))', '#f')
  myexpect('(not \'nil)', '#f')
  myexpect('\'#f', '#f')

  myexpect('(boolean? #f)', '#t')
  myexpect('(boolean? 0)', '#f')
  myexpect('(boolean? \'())', '#f')
})

test('6.3.2', () => {
  myexpect('(let ((x 2) (y 3)) (* x y))', 6)
})

test('6.3.3', () => {
  myexpect('(symbol? \'foo)', '#t')
  myexpect('(symbol? (car \'(a b))) ', '#t')
  myexpect('(symbol? "bar")', '#f')
  myexpect('(symbol? \'nil)', '#t')
  myexpect('(symbol? \'())', '#f')
  myexpect('(symbol? #f)', '#f')
})
