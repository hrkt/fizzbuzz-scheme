'use strict'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('(make-rectangular 1 1) yields 1.0+1.0i', () => {
  expect(new FBS().eval('(make-rectangular 1 1)').toString()).toBe('1.0+1.0i')
})

test('(make-rectangular 1+1i 1) throws exception', () => {
  expect(() => { new FBS().eval('(make-rectangular 1+1i 1)') }).toThrow(FsException)
})

test('(make-rectangular 1 1+1i) throws exception', () => {
  expect(() => { new FBS().eval('(make-rectangular 1 1+1i)') }).toThrow(FsException)
})
