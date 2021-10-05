'use strict'

import log from 'loglevel'

import { FsNumber } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
log.setLevel('info')

const fibonacci = '(define fib (lambda (n) (if (< n 2)' +
' n' +
' (+ (fib (- n 2)) (fib (- n 1))))))'

test('evaluating fibonacci', () => {
  const fbs = new FBS()
  fbs.eval(fibonacci)
  expect(fbs.eval('(fib 0)')).toStrictEqual(new FsNumber(0))
  expect(fbs.eval('(fib 1)')).toStrictEqual(new FsNumber(1))
  expect(fbs.eval('(fib 2)')).toStrictEqual(new FsNumber(1))
  expect(fbs.eval('(fib 10)')).toStrictEqual(new FsNumber(55))
})
