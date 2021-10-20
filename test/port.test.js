'use strict'
import FS from 'fs'

import { FsBoolean, FsList, FsString } from '../src/datatypes.js'
import { FspCloseOutputPort, FspOpenOutputFile, FsPredicatePort, FspStandardOutputPort, PortManager } from '../src/port.js'

test('new PortManager() always gives the same instance', () => {
  const pm1 = new PortManager()
  const pm2 = new PortManager()
  expect(pm1 === pm2).toBe(true)
})

test('get instance and invoke its method success ', () => {
  const pm1 = new PortManager()
  expect(pm1.getStandardOutputPort()).toBe(process.stdout)
})

test('predicate port? success', () => {
  const stdoutPort = FspStandardOutputPort.proc()
  expect(FsPredicatePort.proc(new FsList([stdoutPort]))).toBe(FsBoolean.TRUE)
})

test('open-output-file and close-output-port success', () => {
  const filename = 'test_output'
  const outputPort = FspOpenOutputFile.proc(new FsList([new FsString(filename)]))
  FspCloseOutputPort.proc(new FsList([outputPort]))

  try {
    FS.rmSync(filename)
  } catch (e) {
    console.error(e)
  }
})
