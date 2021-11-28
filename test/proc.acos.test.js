'use strict'

import { FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (acos 1) yields 0.0', () => {
  expect(new FBS().eval('(acos 1)')).toStrictEqual(new FsReal(0))
})

test('evaluating (acos 0.5) yields 1.0471975511965979', () => {
  expect(new FBS().eval('(acos 0.5)')).toStrictEqual(new FsReal(1.0471975511965979))
})

test('evaluating (acos 1+1i) yields 0.9045568943023813-1.0612750619050355i', () => {
  expect(new FBS().eval('(acos 1+1i)').real).toBeCloseTo(0.9045568943023813)
  expect(new FBS().eval('(acos 1+1i)').imaginary).toBeCloseTo(-1.0612750619050355)
})
