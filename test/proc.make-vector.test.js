'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('(make-vector 2) yields #(#undefined #undefined)', () => {
  expect(new FBS().eval('(make-vector 2)').toString()).toBe('#(#undefined #undefined)')
})

test('(make-vector 2 2) yields #(2 2)', () => {
  expect(new FBS().eval('(make-vector 2)').toString()).toBe('#(#undefined #undefined)')
})
