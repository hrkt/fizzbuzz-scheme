'use strict'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('(make-polar 1 1) yields 0.5403023058681398+0.8414709848078965i', () => {
  expect(new FBS().eval('(make-polar 1 1)').toString()).toBe('0.5403023058681398+0.8414709848078965i')
})

test('(make-polar 1+1i 1) throws exception', () => {
  expect(() => { new FBS().eval('(make-polar 1+1i 1)') }).toThrow(FsException)
})

test('(make-polar 1 1+1i) throws exception', () => {
  expect(() => { new FBS().eval('(make-polar 1 1+1i)') }).toThrow(FsException)
})
