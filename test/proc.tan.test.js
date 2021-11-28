'use strict'

import { FsComplex, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (tan 1) yields 1.0839233273386948', () => {
  expect(new FBS().eval('(tan 1)')).toStrictEqual(new FsReal(1.0839233273386948))
})

test('evaluating (tan 1+1i) yields 0.27175258531951174+1.0839233273386948i', () => {
  expect(new FBS().eval('(tan 1+1i)')).toStrictEqual(new FsComplex(0.27175258531951174, 1.0839233273386948))
})
