'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('(make-rectangular 1 1) yields 1.0+1.0i', () => {
  expect(new FBS().eval('(make-rectangular 1 1)').toString()).toBe('1.0+1.0i')
})
