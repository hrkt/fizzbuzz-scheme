'use strict'

import { jest } from '@jest/globals'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('exit success with given exit code', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const fbs = new FBS()
  const main = () => { fbs.eval('(exit 25)') }
  main()
  expect(mockExit).toHaveBeenCalledWith(25)
  mockExit.mockRestore()
})
