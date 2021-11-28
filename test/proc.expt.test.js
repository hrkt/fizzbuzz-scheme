'use strict'

import { FsComplex, FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (expt 2 3) yields 8', () => {
  expect(new FBS().eval('(expt 2 3)')).toStrictEqual(new FsInteger(8))
})

test('evaluating (expt 2.0 3.0) yields 8.0', () => {
  expect(new FBS().eval('(expt 2.0 3.0)')).toStrictEqual(new FsReal(8.0))
})

test('evaluating  (expt 1+1i 2+2i) yields -0.2656539988492411+0.3198181138561361i', () => {
  expect(new FBS().eval('(expt 1+1i 2+2i)')).toStrictEqual(new FsComplex(-0.2656539988492411, 0.3198181138561361))
})
