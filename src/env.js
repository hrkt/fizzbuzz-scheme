'use strict'

import { FsAnd, FsEquals, FsOperatorMod, FsOperatorMinus, FsOperatorPlus, FsSymbol } from './sexp.js'
import log from 'loglevel'

// Environment
export class FsEnv {
  constructor (outer = null, vars = new Map()) {
    this.outer = outer
    this.vars = vars
  }

  // Object keys in JS Map are compared by its ref.
  // Here we convert FsSymbol to string in case we don't have its reference.
  toKey (obj) {
    if (obj instanceof FsSymbol) {
      return obj.toString()
    } else {
      throw new Error('cannot use as key:' + obj)
    }
  }

  set (k, v) {
    log.debug('---------------------------------')
    log.debug('env-set k=:' + k + ',v:' + v)
    log.debug('---------------------------------')
    this.vars.set(this.toKey(k), v)
  }

  find (symbol) {
    const key = this.toKey(symbol)
    log.debug('env-find:' + symbol + ' in:' + this + ' key:' + key)

    if (this.vars.has(key)) {
      return this.vars.get(key)
    } else if (this.outer !== null) {
      return this.outer.find(symbol)
    } else {
      throw new Error('Symbol [' + symbol + '] is not found.')
    }
  }

  toString () {
    let buf = ''
    if (this.outer !== null) {
      buf += '[' + this.outer.toString() + ']'
    }
    return buf + '>>[' + Array.from(this.vars.keys()) + ']'
  }
}

// get global environment
export function getGlobalEnv () {
  const env = new FsEnv()
  env.set(new FsSymbol('+'), FsOperatorPlus.proc)
  env.set(new FsSymbol('-'), FsOperatorMinus.proc)
  env.set(new FsSymbol('mod'), FsOperatorMod.proc)
  env.set(new FsSymbol('='), FsEquals.proc)
  env.set(new FsSymbol('and'), FsAnd.proc)
  return env
}
