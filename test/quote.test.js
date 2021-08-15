'use strict'

import * as util from './testutil.js'

import { FsNumber, FsValue } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (quote 1) yields 1', () => {
  const code = '(quote 1)'
  // util.codeEvaledTo(code, new FsNumber(1))
  util.codeEvaledTo(code, new FsValue(new FsNumber(1)))
})

test('evaluating (quote (+ 1 1)) yields (+ 1 1)', () => {
  const code = '(quote (+ 1 1))'
  const fbs = new FizzBuzzScheme()
  const evaled = fbs.eval(code)
  console.dir(evaled)
  // log.debug(FsEvaluator.eval(parsed))
  // expect(FsEvaluator.eval(parsed).toString()).toBe('(+ 1 1)')
})

// test('evaluating \'a yields FsString(a)', () => {
//   const code = '\'a'
//   const fbs = new FizzBuzzScheme()
//   const evaled = fbs.eval(code)
//   console.dir(evaled)
//   expect(evaled).toStrictEqual(new FsString('a'))
// })
