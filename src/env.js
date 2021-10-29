'use strict'

import log from 'loglevel'

import { FsError, FsException } from './common.js'
import { FsNumber } from './datatypes.js'
import { FsSymbol } from './symbol.js'

const __FBS__QUASIQUOTE_LEVEL = '__FBS__QUASIQUOTE_LEVEL'
export const FBS_QUASIQUOTE_LEVEL = new FsSymbol(__FBS__QUASIQUOTE_LEVEL)
const __FBS__UNQUOTE_LEVEL = '__FBS__UNQUOTE_LEVEL'
export const FBS_UNQUOTE_LEVEL = new FsSymbol(__FBS__UNQUOTE_LEVEL)

const __FBS__CURRENT_INPUT_PORT = '__FBS__CURRENT_INPUT_PORT'
const FBS__CURRENT_INPUT_PORT = new FsSymbol(__FBS__CURRENT_INPUT_PORT)
const __FBS__CURRENT_OUTPUT_PORT = '__FBS__CURRENT_OUTPUT_PORT'
const FBS__CURRENT_OUTPUT_PORT = new FsSymbol(__FBS__CURRENT_OUTPUT_PORT)

// Environment
export class FsEnv {
  static counter = 0

  // use {} instead of new Map() because it is bit faster on benchmarking on fib(30)
  // constructor (outer = null, vars = new Map()) {
  constructor (outer = null, vars = Object.create(null)) {
    this.outer = outer
    this.vars = vars
    this._id = FsEnv.counter++
  }

  get id () {
    return this._id
  }

  // Object keys in JS Map are compared by its ref.
  // Here we convert FsSymbol to string in case we don't have its reference.
  static toKey (obj) {
    if (obj !== null && obj.type === 'fssymbol') {
      // return obj.toString()
      // value of FsSymbol is not falcy. simply use its value as key.
      return obj.value
    } else {
      throw new FsError('cannot use as key:' + obj)
    }
  }

  /**
   * add symbol-value pair to the environment
   *
   * This function symple behave like hash, so
   * the existence of symbol should be checked before calling this function
   * in (set! procedure.
   *
   * This function does not use recursion so as not to hit the maximum-call-stack.
   *
   * @param {*} symbol as key of new entry
   * @param {*} value as value of new entry
   * @returns a value of new entry
   */
  set (symbol, value) {
    const key = FsEnv.toKey(symbol)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('---------------------------------')
      log.debug('env-set key=:' + key + ',value:' + value + ',in:id=' + this.id)
      log.debug('---------------------------------')
    }

    if (this.outer !== null) {
      let nextOuter = this.outer
      while (nextOuter !== null) {
        const currentValue = nextOuter.vars[key]
        if (currentValue !== undefined) {
          nextOuter.vars[key] = value
          return
        }
        nextOuter = nextOuter.outer
      }
    }

    this.vars[key] = value
  }

  find (symbol) {
    const key = FsEnv.toKey(symbol)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('env-find:' + symbol + ' in:' + this + ' key:' + key)
    }

    const v = this.vars[key]
    if (v !== undefined) {
      return v
    } else if (this.outer !== null) {
      // calling outer like below results in exeeding maximum call stack,
      // so we simply use for-loop in this method, and do nut use recursive call.
      //
      // return this.outer.find(symbol)
      let nextOuter = this.outer
      while (nextOuter !== null) {
        const v = nextOuter.vars[key]
        if (v !== undefined) {
          return v
        }
        nextOuter = nextOuter.outer
      }
    } else {
      throw new FsException('Symbol [' + symbol + '] is not found.')
    }
  }

  clearVars () {
    this.vars = Object.create(null)
    if (this.outer !== null) {
      let nextOuter = this.outer
      while (nextOuter !== null && nextOuter.outer !== null) {
        nextOuter.vars = Object.create(null)
        nextOuter = nextOuter.outer
      }
    }
  }

  increaseQuasiquoteDepth () {
    const current = this.find(FBS_QUASIQUOTE_LEVEL)
    const next = new FsNumber(current.value + 1)
    const key = FsEnv.toKey(FBS_QUASIQUOTE_LEVEL)
    this.vars[key] = next
  }

  increaseUnquoteDepth () {
    const current = this.find(FBS_UNQUOTE_LEVEL)
    const next = new FsNumber(current.value + 1)
    const key = FsEnv.toKey(FBS_UNQUOTE_LEVEL)
    this.vars[key] = next
  }

  isInQuasiquote () {
    return (this.find(FBS_QUASIQUOTE_LEVEL)).value > 0
  }

  isSameQuasiquoteAndUnquoteLevel () {
    const quasiquoteLevel = this.find(FBS_QUASIQUOTE_LEVEL)
    const unquoteLevel = this.find(FBS_UNQUOTE_LEVEL)
    return quasiquoteLevel.value === unquoteLevel.value
  }

  isUnquoteLevelIsEqualOrDeeperThanQuasiquoteLevel () {
    const quasiquoteLevel = this.find(FBS_QUASIQUOTE_LEVEL)
    const unquoteLevel = this.find(FBS_UNQUOTE_LEVEL)
    return unquoteLevel.value >= quasiquoteLevel.value
  }

  getCurrentInputPort () {
    return this.find(FBS__CURRENT_INPUT_PORT)
  }

  setCurrentInputPort (port) {
    this.vars[FsEnv.toKey(FBS__CURRENT_INPUT_PORT)] = port
  }

  getCurrentOutputPort () {
    return this.find(FBS__CURRENT_OUTPUT_PORT)
  }

  setCurrentOutputPort (port) {
    this.vars[FsEnv.toKey(FBS__CURRENT_OUTPUT_PORT)] = port
  }

  toString () {
    if (this.outer === null) {
      return '>>ROOT'
    } else {
      // return '>>id' + this.id + ' [' + Array.from(this.vars.keys()).map(k => k + '=' + this.vars.get(k)) + ']'
      return JSON.stringify(this.vars)
    }
  }
}
