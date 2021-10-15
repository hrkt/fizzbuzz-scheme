'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsSymbol } from '../src/symbol.js'

test('evaluating (gensym) yields FsSymbol', () => {
  expect(new FBS().eval('(gensym)')).toBeInstanceOf(FsSymbol)
})

test('evaluating (gensym) multiple times yields different symbols', () => {
  const fbs = new FBS()
  const s1 = fbs.eval('(gensym)')
  const s2 = fbs.eval('(gensym)')
  expect(s1.value).not.toBe(s2.value)
})
