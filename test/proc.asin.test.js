'use strict'

import { FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (asin 1) yields 1.5707963267948966', () => {
  expect(new FBS().eval('(asin 1)')).toStrictEqual(new FsReal(1.5707963267948966))
})

test('evaluating (asin 1+1i) yields 0.6662394324925153+1.0612750619050355i', () => {
  expect(new FBS().eval('(asin 1+1i)').real).toBeCloseTo(0.6662394324925153)
  expect(new FBS().eval('(asin 1+1i)').imaginary).toBeCloseTo(1.0612750619050355)
})
