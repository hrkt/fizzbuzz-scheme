'use strict'

import FS from 'fs'
import log from 'loglevel'
import * as os from 'os'

import { FsException } from './common.js'
import { FsBoolean, FsString } from './datatypes.js'
import { FsEvaluator } from './evaluator.js'
import { FsExpander } from './expander.js'
import { FsParser } from './parser.js'
import { FsUndefined } from './sexp.js'
import { FsSExp } from './sexpbase.js'
import { ensureListLengthAtLeast } from './sexputils.js'
import { FsSymbol } from './symbol.js'

export class PortManager {
  static #_instance = null
  constructor () {
    if (!PortManager.#_instance) {
      PortManager.#_instance = this
    } else {
      return PortManager.#_instance
    }
    log.debug('created a singleton object of port manager ')
  }

  getStandardInputPort () {
    return process.stdin
  }

  getStandardOutputPort () {
    return process.stdout
  }

  getAllDataFromFile (filename, encoding = 'utf8') {
    try {
      return FS.readFileSync(filename, encoding)
    } catch (e) {
      log.error(e)
      throw new FsException('error in loading file:' + filename, e)
    }
  }

  openOutputFile (filename, encoding = 'utf8') {
    try {
      return FS.openSync(filename, 'w')
    } catch (e) {
      log.error(e)
      throw new FsException('error in opening file for output:' + filename, e)
    }
  }

  closeOutputFile (fd) {
    try {
      return FS.closeSync(fd)
    } catch (e) {
      log.error(e)
      throw new FsException('error in closing fd:' + fd, e)
    }
  }

  writeToFile (fd, str) {
    FS.writeSync(fd, str)
  }
}

// ports

export class FsPort {
  #closed = false

  constructor (port) {
    this.port = port
  }

  close () {
    this.#closed = true
  }

  isClosed () {
    return this.#closed
  }
}

export class FsInputPort extends FsPort {
}

export class FsOutputPort extends FsPort {
}

export class FsFileOutputPort extends FsOutputPort {
  #fd = null
  constructor (fd) {
    super()
    this.#fd = fd
  }

  close () {
    super.close()
    const portManager = new PortManager()
    portManager.closeOutputFile(this.#fd)
  }

  write (obj) {
    const portManager = new PortManager()
    portManager.writeToFile(this.#fd, '' + obj)
  }

  writeln (obj) {
    const portManager = new PortManager()
    portManager.writeToFile(this.#fd, '' + obj + os.EOL)
  }
}

export class FspConsoleInputPort extends FsOutputPort {
  constructor (fd) {
    super()
  }

  close () {
    super.close()
  }

  write (obj) {
    const portManager = new PortManager()
    return portManager.getStandardOutputPort().read()
  }
}

export class FspConsoleOutputPort extends FsOutputPort {
  constructor (fd) {
    super()
  }

  close () {
    super.close()
  }

  write (obj) {
    const portManager = new PortManager()
    portManager.getStandardOutputPort().write(obj)
  }

  writeln (obj) {
    this.write(obj + os.EOL)
  }
}

export class FsStringInputPort extends FsInputPort {
  #data = ''
  #pos = 0
  #length = 0
  constructor (data) {
    super()
    this.#data = data
    this.#length = data.length
  }

  readChar () {
    if (this.#pos === this.#length) {
      return FsSymbol.EOF_OBJECT
    }
    return this.#data.charAt(this.#pos++)
  }
}

export class FspCurrentInputPort {
  static proc (args, env) {
    return env.getCurrentInputPort()
  }
}

export class FspCurrentOutputPort {
  static proc (args, env) {
    return env.getCurrentOutputPort()
  }
}

export class FspStandardInputPort {
  static proc (args, env) {
    return new FsInputPort(new PortManager().getStandardInputPort())
  }
}

export class FspStandardOutputPort {
  static proc (args, env) {
    return new FsOutputPort(new PortManager().getStandardOutputPort())
  }
}

// predicates

export class FsPredicatePort {
  static proc (args, env) {
    return args.at(0) instanceof FsPort ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

// procedures

export class FspCloseInputPort {
  static proc (args, env) {
    if (args.at(0) instanceof FsInputPort) {
      const p = args.at(0)
      p.close()
    } else {
      throw new FsException('not an input port: ' + args.at(0))
    }
  }
}

export class FspCloseOutputPort {
  static proc (args, env) {
    if (args.at(0) instanceof FsOutputPort) {
      const p = args.at(0)
      p.close()
      return FsUndefined.UNDEFINED
    } else {
      throw new FsException('not an input port: ' + args.at(0))
    }
  }
}

export class FspOpenInputFile {
  static proc (args, env) {
    const portManager = new PortManager()
    const filename = args.at(0).value // TODO: check it
    const data = portManager.getAllDataFromFile(filename, 'utf8')

    return new FsStringInputPort(data)
  }
}

export class FspOpenOutputFile {
  static proc (args, env) {
    const portManager = new PortManager()
    const filename = args.at(0).value // TODO: check it
    const file = portManager.openOutputFile(filename, 'utf8')
    return new FsFileOutputPort(file)
  }
}

export class FspReadChar {
  static proc (args, env) {
    const port = args.at(0)

    return port.readChar()
  }
}

export class FslpWrite extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 1)
    const port = (list.length === 1) ? env.getCurrentOutputPort() : list.at(1)
    if (!(port instanceof FsOutputPort)) {
      throw new FsException('given arg is not a port:' + port)
    }
    port.write('' + list.at(0).value)
    return FsUndefined.UNDEFINED
  }
}

export class FslpNewline extends FsSExp {
  static proc (list, env) {
    const port = (list.length === 0) ? env.getCurrentOutputPort() : list.at(0)
    if (!(port instanceof FsOutputPort)) {
      throw new FsException('given arg is not a port:' + port)
    }
    port.writeln('')
    return FsUndefined.UNDEFINED
  }
}

// print s-exp in list. For FsString, print its value without double quotes.
export class FslpDisplay extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 1)
    const v = (list.at(0) instanceof FsString ? list.at(0).value : list.at(0).toString())
    list.value[0] = new FsString(v)
    FslpWrite.proc(list, env)

    return FsUndefined.UNDEFINED
  }
}

export class FsopLoad extends FsSExp {
  static proc (list, env) {
    // TODO: utilize this in cli.js and index.js
    const file = list.at(0).value
    log.debug('loading ' + file)
    try {
      const data = FS.readFileSync(file, 'utf8')
      const parsed = FsParser.parse(data)
      const expander = new FsExpander()
      const expanded = expander.expand(parsed)
      for (let i = 0; i < expanded.length; i++) {
        FsEvaluator.eval(expanded[i], env)
      }
      return FsUndefined.UNDEFINED
    } catch {
      throw new FsException('error in loading file:' + file)
    }
  }
}
