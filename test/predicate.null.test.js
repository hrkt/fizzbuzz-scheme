'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/datatypes.js'

test('evaluating (null? ()) yields #t', () => {
  const code = '(null? ())'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (null? #t) yields #f', () => {
  const code = '(null? #t)'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (null? 1) yields #f', () => {
  const code = '(null? 1)'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (null? (define x 1)) yields #f', () => {
  const code = '(null? (define x 1))'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.FALSE)
})
