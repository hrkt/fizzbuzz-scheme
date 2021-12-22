'use strict'
import FS from 'fs'
import * as os from 'os'

import { FsBoolean, FsList, FsString } from '../src/datatypes.js'
import { FizzBuzzScheme } from '../src/index.js'
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

test('open-output-file, write and close-output-port success', () => {
  const filename = 'test_output'

  const code = `
  (let
    ( (port (open-output-file "${filename}")) )
    (display "Hello" port)
    (newline port)
    (display "world" port)
    (write-char #\\! port)
    (close-output-port port)
  )`
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)

  try {
    expect(FS.existsSync(filename)).toBe(true)
    const buf = FS.readFileSync(filename)
    expect(buf.toString()).toBe('Hello' + os.EOL + 'world!')

    FS.rmSync(filename)
  } catch (e) {
    console.error(e)
  }
})
