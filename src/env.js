'use strict'

import { FsAnd, FsEquals, FsNewline, FsOperatorDivide, FsOperatorGt, FsOperatorGte, FsOperatorLt, FsOperatorLte, FsOperatorMinus, FsOperatorMod, FsOperatorMultiply, FsOperatorPlus, FsSymbol, FsWrite } from './sexp.js'
import log from 'loglevel'

// Environment
export class FsEnv {
  static counter = 0
  constructor (outer = null, vars = new Map()) {
    this.outer = outer
    this.vars = vars
    this.id = FsEnv.counter++
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
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('---------------------------------')
      log.debug('env-set k=:' + k + ',v:' + v + ',in:id=' + this.id)
      log.debug('---------------------------------')
    }
    this.vars.set(this.toKey(k), v)
  }

  find (symbol) {
    const key = this.toKey(symbol)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('env-find:' + symbol + ' in:' + this + ' key:' + key)
    }

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
    // return buf + '>>[' + Array.from(this.vars.keys()) + ']'
    if (this.outer === null) {
      return '>>ROOT'
    } else {
      return buf + '>>id' + this.id + ' [' + Array.from(this.vars.keys()).map(k => k + '=' + this.vars.get(k)) + ']'
    }
  }
}

// get global environment
export function getGlobalEnv () {
  const env = new FsEnv()
  env.set(new FsSymbol('+'), FsOperatorPlus)
  env.set(new FsSymbol('-'), FsOperatorMinus)
  env.set(new FsSymbol('*'), FsOperatorMultiply)
  env.set(new FsSymbol('/'), FsOperatorDivide)
  env.set(new FsSymbol('mod'), FsOperatorMod)
  env.set(new FsSymbol('='), FsEquals)
  env.set(new FsSymbol('<'), FsOperatorLt)
  env.set(new FsSymbol('<='), FsOperatorLte)
  env.set(new FsSymbol('>'), FsOperatorGt)
  env.set(new FsSymbol('>='), FsOperatorGte)
  env.set(new FsSymbol('and'), FsAnd)
  env.set(new FsSymbol('write'), FsWrite)
  env.set(new FsSymbol('newline'), FsNewline)
  return env
}
