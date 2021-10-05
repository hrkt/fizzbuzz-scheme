'use strict'

import { FsNumber, FsPair } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('toString pair object with car=1, cons=2 yields (1 . 2)', () => {
  const p = new FsPair(new FsNumber(1), new FsNumber(2))
  expect(p.toString()).toBe('(1 . 2)')
})

test('evaluating (cons 1 2) yields (1 . 2)', () => {
  const code = '(cons 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsPair(new FsNumber(1), new FsNumber(2)))
})
