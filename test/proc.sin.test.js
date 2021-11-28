'use strict'

import { FsComplex, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (sin 1) yields 0.8414709848078965', () => {
  expect(new FBS().eval('(sin 1)')).toStrictEqual(new FsReal(0.8414709848078965))
})

test('evaluating (sin 1+1i) yields 1.2984575814159773+0.6349639147847361i', () => {
  expect(new FBS().eval('(sin 1+1i)')).toStrictEqual(new FsComplex(1.2984575814159773, 0.6349639147847361))
})
