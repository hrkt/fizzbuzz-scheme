'use strict'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (inexact->exact 1+2i) throws exception', () => {
  expect(() => { new FBS().eval('(inexact->exact 1+1i)') }).toThrow(FsException)
})

test('evaluating (inexact->exact "a") throws exception', () => {
  expect(() => { new FBS().eval('(inexact->exact "a")') }).toThrow(FsException)
})
