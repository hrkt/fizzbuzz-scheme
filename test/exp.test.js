'use strict'

import { FsList, FsNumber } from '../src/sexp.js'

test('exp with 2 numbers success', () => {
  const exp = new FsList([new FsNumber(1), new FsNumber(2)])
  expect(exp.toString()).toBe('(1 2)')
})
