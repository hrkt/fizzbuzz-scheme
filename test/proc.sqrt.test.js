'use strict'

import { FsComplex, FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (sqrt 4) yields 2', () => {
  expect(new FBS().eval('(sqrt 4)')).toStrictEqual(new FsInteger(2))
})

test('evaluating (sqrt 4.0) yields 2.0', () => {
  expect(new FBS().eval('(sqrt 4.0)')).toStrictEqual(new FsReal(2.0))
})

// TODO: diff exists in small number. In this test case, I choose 2+2i
// gosh:  (sqrt 1+1i) ==> 1.0986841134678098+0.45508986056222733i
// fbs:   (sqrt 1;1i) =>> 1.09868411346781+0.4550898605622274i
test('evaluating (sqrt 2+2i) yields 1.5537739740300374+0.6435942529055827i', () => {
  expect(new FBS().eval('(sqrt 2+2i)')).toStrictEqual(new FsComplex(1.5537739740300374, 0.6435942529055827))
})

test('evaluating (sqrt 2-2i) yields 1.5537739740300374-0.6435942529055827i', () => {
  expect(new FBS().eval('(sqrt 2-2i)')).toStrictEqual(new FsComplex(1.5537739740300374, -0.6435942529055827))
})
