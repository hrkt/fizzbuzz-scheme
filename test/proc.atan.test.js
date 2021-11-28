'use strict'

import { FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (atan 1) yields 0.7853981633974483', () => {
  expect(new FBS().eval('(atan 1)')).toStrictEqual(new FsReal(0.7853981633974483))
})

test('evaluating (atan 1+1i) yields 1.0172219678978514+0.4023594781085251i', () => {
  expect(new FBS().eval('(atan 1+1i)').real).toBeCloseTo(1.0172219678978514)
  expect(new FBS().eval('(atan 1+1i)').imaginary).toBeCloseTo(0.4023594781085251)
})

test('evaluating (atan 1 1) yields 1.0172219678978514+0.4023594781085251i', () => {
  expect(new FBS().eval('(atan 1 1)').real).toBeCloseTo(1.0172219678978514)
  expect(new FBS().eval('(atan 1 1)').imaginary).toBeCloseTo(0.4023594781085251)
})
