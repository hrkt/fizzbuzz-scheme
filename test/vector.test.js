'use strict'

import { FsVector } from '../src/datatypes.js'

test('creating vector success', () => {
  const vector = new FsVector([1, 2, 3])
  expect(vector).toStrictEqual(new FsVector([1, 2, 3]))
})

test('stringify vector success', () => {
  const vector = new FsVector([1, 2, 3])
  expect(vector.toString()).toBe('#(1 2 3)')
})
