'use strict'

import { FsBoolean } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsException } from '../src/common.js'

test('evaluating (load "test/code/load.test.scm") success', () => {
  // (define is-successfully-loaded #t) ; <- load this
  const code = '(load "test/code/load.test.scm")'
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('is-successfully-loaded')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (load "test/code/file-that-does-not-exist") throws FsException', () => {
  // (define is-successfully-loaded #t) ; <- load this
  const code = '(load "test/code/file-that-does-not-exist")'
  const fbs = new FBS()
  expect(() => { fbs.eval(code) }).toThrow(FsException)
})