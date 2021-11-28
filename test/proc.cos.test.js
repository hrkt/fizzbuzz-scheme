'use strict'

import { FsComplex, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (cos 1) yields 0.5403023058681398', () => {
  expect(new FBS().eval('(cos 1)')).toStrictEqual(new FsReal(0.5403023058681398))
})

test('evaluating (cos 1+1i) yields 0.8337300251311491-0.9888977057628651i', () => {
  expect(new FBS().eval('(cos 1+1i)')).toStrictEqual(new FsComplex(0.8337300251311491, 0.9888977057628651))
})
