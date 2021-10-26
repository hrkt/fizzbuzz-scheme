'use strict'

import log from 'loglevel'

import { FsError, FsException } from './common.js'
import { FsNumber } from './datatypes.js'
import { FslpDisplay, FslpNewline, FslpWrite, FsopLoad, FspCloseInputPort, FspCloseOutputPort, FspConsoleInputPort, FspConsoleOutputPort, FspCurrentInputPort, FspCurrentOutputPort, FspOpenInputFile, FspOpenOutputFile, FspReadChar, FspStandardInputPort, FspStandardOutputPort } from './port.js'
import { FsPredicateBoolean, FsPredicateEq, FsPredicateEqual, FsPredicateEqv, FsPredicateList, FsPredicateNull, FsPredicateNumber, FsPredicatePair, FsPredicateProcedure, FsPredicateSymbol, FsPredicateVector } from './predicates.js'
import { FslpAbs, FslpAppend, FslpLength, FslpList, FslpMap, FslpNot, FslsAnd, FslsLet, FspCallCc, FspCar, FspCdr, FspCons, FspDivide, FsPeekMemoryUsage, FspGensym, FspGt, FspGte, FspLastPair, FspLt, FspLte, FspMax, FspMin, FspMinus, FspMod, FspMultiply, FspNumberEquals, FspPlus, FspPow, FspRound, FspSetCdr, FspSqrt, FspSymbolToString, FssBegin, FssDefine, FssIf, FssLambda, FssSet, FssUnquote } from './sexp.js'
import { FsSymbol } from './symbol.js'
import { FspMakeVector, FspVector, FspVectorRef, FspVectorSet } from './vector-operations.js'

const __FBS__QUASIQUOTE_LEVEL = '__FBS__QUASIQUOTE_LEVEL'
const FBS_QUASIQUOTE_LEVEL = new FsSymbol(__FBS__QUASIQUOTE_LEVEL)
const __FBS__UNQUOTE_LEVEL = '__FBS__UNQUOTE_LEVEL'
const FBS_UNQUOTE_LEVEL = new FsSymbol(__FBS__UNQUOTE_LEVEL)

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

// get global environment
export function getGlobalEnv () {
  const env = new FsEnv()
  const prev = log.getLevel()
  log.setLevel('error')

  // used in eval-each-switches
  env.set(FsSymbol.BACK_QUOTE, null)
  env.set(FsSymbol.BEGIN, FssBegin)
  env.set(FsSymbol.IF, FssIf)
  env.set(FsSymbol.DEFINE, FssDefine)
  env.set(FsSymbol.LAMBDA, FssLambda)
  env.set(FsSymbol.LET, FslsLet)
  env.set(FsSymbol.QUOTE, null)
  env.set(FsSymbol.SET_, FssSet)
  env.set(FsSymbol.SET_CDR_, FspSetCdr)
  env.set(FsSymbol.UNQUOTE, null) // treated inside of FssQuasiQuote()

  // used in eval-last
  env.set(new FsSymbol('+'), FspPlus.proc)
  // also we can provide JS function as value like below.
  // env.set(new FsSymbol('+'), (list) => { return new FsNumber(list.value.map(n => n.value).reduce((a, b) => a + b, 0)) })
  env.set(new FsSymbol('-'), FspMinus.proc)
  env.set(new FsSymbol('*'), FspMultiply.proc)
  env.set(new FsSymbol('/'), FspDivide.proc)
  env.set(new FsSymbol(','), FssUnquote.proc)
  env.set(new FsSymbol('mod'), FspMod.proc)
  env.set(new FsSymbol('pow'), FspPow.proc)
  env.set(new FsSymbol('='), FspNumberEquals.proc)
  env.set(new FsSymbol('<'), FspLt.proc)
  env.set(new FsSymbol('<='), FspLte.proc)
  env.set(new FsSymbol('>'), FspGt.proc)
  env.set(new FsSymbol('>='), FspGte.proc)
  env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc)
  env.set(new FsSymbol('and'), FslsAnd.proc)
  env.set(new FsSymbol('append'), FslpAppend.proc)
  env.set(new FsSymbol('abs'), FslpAbs.proc)
  env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc)
  env.set(new FsSymbol('call-with-current-continuation'), FspCallCc.proc)
  env.set(new FsSymbol('call/cc'), FspCallCc.proc)
  env.set(new FsSymbol('car'), FspCar.proc)
  env.set(new FsSymbol('cdr'), FspCdr.proc)
  env.set(new FsSymbol('close-input-port'), FspCloseInputPort.proc)
  env.set(new FsSymbol('close-output-port'), FspCloseOutputPort.proc)
  env.set(new FsSymbol('cons'), FspCons.proc)
  env.set(new FsSymbol('current-input-port'), FspCurrentInputPort.proc)
  env.set(new FsSymbol('current-output-port'), FspCurrentOutputPort.proc)
  env.set(new FsSymbol('display'), FslpDisplay.proc)
  env.set(new FsSymbol('eq?'), FsPredicateEq.proc)
  env.set(new FsSymbol('eqv?'), FsPredicateEqv.proc)
  env.set(new FsSymbol('equal?'), FsPredicateEqual.proc)
  env.set(new FsSymbol('gensym'), FspGensym.proc)
  env.set(new FsSymbol('last-pair'), FspLastPair.proc)
  env.set(new FsSymbol('length'), FslpLength.proc)
  env.set(new FsSymbol('list'), FslpList.proc)
  env.set(new FsSymbol('list?'), FsPredicateList.proc)
  env.set(new FsSymbol('load'), FsopLoad.proc)
  env.set(new FsSymbol('make-vector'), FspMakeVector.proc)
  env.set(new FsSymbol('map'), FslpMap.proc)
  env.set(new FsSymbol('max'), FspMax.proc)
  env.set(new FsSymbol('min'), FspMin.proc)
  env.set(new FsSymbol('newline'), FslpNewline.proc)
  env.set(new FsSymbol('not'), FslpNot.proc)
  env.set(new FsSymbol('null?'), FsPredicateNull.proc)
  env.set(new FsSymbol('number?'), FsPredicateNumber.proc)
  env.set(new FsSymbol('open-input-file'), FspOpenInputFile.proc)
  env.set(new FsSymbol('open-output-file'), FspOpenOutputFile.proc)
  env.set(new FsSymbol('pair?'), FsPredicatePair.proc)
  env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc)
  // env.set(new FsSymbol('quasiquote'), FssQuasiQuote.proc)
  env.set(new FsSymbol('read-char'), FspReadChar.proc)
  env.set(new FsSymbol('round'), FspRound.proc)
  env.set(new FsSymbol('sqrt'), FspSqrt.proc)
  env.set(new FsSymbol('standard-input-port'), FspStandardInputPort.proc)
  env.set(new FsSymbol('standard-output-port'), FspStandardOutputPort.proc)
  env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc)
  env.set(new FsSymbol('symbol->string'), FspSymbolToString.proc)
  // env.set(new FsSymbol('unquote'), FssUnquote.proc)
  env.set(new FsSymbol('vector'), FspVector.proc)
  env.set(new FsSymbol('vector-ref'), FspVectorRef.proc)
  env.set(new FsSymbol('vector-set!'), FspVectorSet.proc)
  env.set(new FsSymbol('vector?'), FsPredicateVector.proc)
  env.set(new FsSymbol('write'), FslpWrite.proc)

  // original
  env.set(new FsSymbol('exit'), (list) => { list !== undefined && list.length > 0 ? process.exit(list.at(0).value) : process.exit(0) })
  env.set(new FsSymbol('fs-set-loglevel'), (list) => { list !== undefined && list.length === 1 ? log.setLevel(list.at(0).value) : process.exit(0) })
  env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc)

  env.set(FBS_QUASIQUOTE_LEVEL, new FsNumber(0))
  env.set(FBS_UNQUOTE_LEVEL, new FsNumber(0))

  // set default port
  env.setCurrentInputPort(new FspConsoleInputPort())
  env.setCurrentOutputPort(new FspConsoleOutputPort())

  log.setLevel(prev)
  return env
}
