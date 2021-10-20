'use strict'

import FS from 'fs'
import log from 'loglevel'

import { FsException } from './common.js'
import { FsBoolean } from './datatypes.js'
import { FsEvaluator } from './evaluator.js'
import { FsExpander } from './expander.js'
import { FsParser } from './parser.js'
import { FsUndefined } from './sexp.js'
import { FsSExp } from './sexpbase.js'
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

export class FspWrite extends FsSExp {
  static proc (list) {
    process.stdout.write(list.value.map(s => s.value).join(' '))
    return FsUndefined.UNDEFINED
  }
}

export class FspNewline extends FsSExp {
  static proc (list) {
    console.log()
    return FsUndefined.UNDEFINED
  }
}

export class FspLoad extends FsSExp {
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
