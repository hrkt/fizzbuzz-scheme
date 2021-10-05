'use strict'
import { jest } from '@jest/globals'
import FS from 'fs'
import mockProcess from 'jest-mock-process'

import { FizzBuzzScheme } from '../src/index.js'

// log.setLevel('debug')

function testStdoutCalled (fbs, code) {
  const mockStdout = mockProcess.mockProcessStdout()
  fbs.eval('(fizzbuzz 1)')
  mockStdout.mockRestore()
}

test('executing fizz-buzz sample success', () => {
  jest.spyOn(process.stdout, 'write')

  const code = FS.readFileSync('./sample/fizzbuzz.scm', 'utf8')

  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  testStdoutCalled(fbs, '(fizzbuzz 1)', '1')
  testStdoutCalled(fbs, '(fizzbuzz 2)', '2')
  testStdoutCalled(fbs, '(fizzbuzz 3)', 'fizz')
  testStdoutCalled(fbs, '(fizzbuzz 4)', '4')
  testStdoutCalled(fbs, '(fizzbuzz 5)', 'buzz')
  testStdoutCalled(fbs, '(fizzbuzz 6)', 'fizz')
  testStdoutCalled(fbs, '(fizzbuzz 7)', '7')
  testStdoutCalled(fbs, '(fizzbuzz 14)', '14')
  testStdoutCalled(fbs, '(fizzbuzz 15)', 'fizzbuzz')
  testStdoutCalled(fbs, '(fizzbuzz 16)', '16')
})
