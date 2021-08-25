'use strict'

import { jest } from '@jest/globals'
import log from 'loglevel'
import { FsCli } from '../src/cli.js'
log.setLevel('info')

test('no argv prints usage', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  const main = () => { FsCli.main(['node', 'fbs.js']) }
  main()
  expect(mockExit).toHaveBeenCalledWith(0)
  expect(mockConsoleLog).toHaveBeenCalledWith('usage: node fbs.js {file}')
  mockExit.mockRestore()
  mockConsoleLog.mockRestore()
})

test('run fib10 sample success', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
  const main = () => { FsCli.main(['node', 'fbs.js', 'sample/fibonacci.scm', 'sample/fib10.scm']) }
  main()
  expect(mockExit).toHaveBeenCalledWith(0)
  expect(mockStdoutWrite).toHaveBeenCalledWith('55')
  mockExit.mockRestore()
  mockStdoutWrite.mockRestore()
})
