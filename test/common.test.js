'use strict'

import { FsError, FsException } from '../src/common.js'

test('calling FsException\'s toString() contains a message', () => {
  const e = new FsException('a test error')
  expect(e.toString()).toBe('FsException: "a test error"')
})

test('calling FsError\'s toString() contains a message', () => {
  const e = new FsError('a test error')
  expect(e.toString()).toBe('FsError: "a test error"')
})
