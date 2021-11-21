'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (number->string 10) yields "10"', () => {
  expect(new FBS().eval('(number->string 10)')).toStrictEqual(new FsString('10'))
})

test('evaluating (number->string 1.00) yields "1.00"', () => {
  expect(new FBS().eval('(number->string 1.0)')).toStrictEqual(new FsString('1.0'))
})

test('evaluating (number->string 3/2) yields "3/2"', () => {
  expect(new FBS().eval('(number->string 3/2)')).toStrictEqual(new FsString('3/2'))
})

test('evaluating (number->string 1+2i) yields "1+2i"', () => {
  expect(new FBS().eval('(number->string 1+2i)')).toStrictEqual(new FsString('1+2i'))
})
