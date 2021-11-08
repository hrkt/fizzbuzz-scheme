'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating call/cc 1', () => {
  const code = `(call/cc (lambda (throw)
  (+ 5 (* 10 (call/cc (lambda (escape) (* 100 (escape 3))))))))
`
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(35))
})

test('evaluating call/cc 2', () => {
  const code = `(call/cc (lambda (throw)
  (+ 5 (* 10 (call/cc (lambda (escape) (* 100 (throw 3))))))))
`
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(3))
})
