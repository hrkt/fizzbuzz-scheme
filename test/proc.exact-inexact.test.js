'use strict'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (exact->inexact 1+2i) throws exception', () => {
  expect(() => { new FBS().eval('(exact->inexact 1+1i)') }).toThrow(FsException)
})

test('evaluating (exact->inexact "a") throws exception', () => {
  expect(() => { new FBS().eval('(exact->inexact "a")') }).toThrow(FsException)
})
