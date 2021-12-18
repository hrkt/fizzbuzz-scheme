'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (string->list "abc") yields (#\\a #\\b #\\c)', () => {
  expect(new FBS().eval('(string->list "abc")').toString()).toStrictEqual('(#\\a #\\b #\\c)')
})
