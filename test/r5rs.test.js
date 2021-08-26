// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-2.html#%_toc_start

'use strict'

import { FizzBuzzScheme } from '../src/index.js'
import { jest } from '@jest/globals'

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
  const code = `(define add4
    (let ((x 4))
      (lambda (y) (+ x y))))
  (add4 6)
  `
  myexpect(code, 10)
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
