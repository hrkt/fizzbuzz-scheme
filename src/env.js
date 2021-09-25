'use strict'

import { FsAnd, FsBegin, FsCar, FsCdr, FsCons, FsDefine, FsDisplay, FsIf, FsLambda, FsLet, FsList, FsNewline, FsNot, FsNumberEquals, FsProcedureAbs, FsProcedureDivide, FsProcedureGt, FsProcedureGte, FsProcedureLt, FsProcedureLte, FsProcedureMinus, FsProcedureMod, FsProcedureMultiply, FsProcedurePlus, FsProcedurePow, FsProcedureRound, FsPeekMemoryUsage, FsPredicateBoolean, FsPredicateEq, FsPredicateEqual, FsPredicateList, FsPredicateNull, FsPredicateNumber, FsPredicatePair, FsPredicateProcedure, FsPredicateSymbol, FsPredicateVector, FsProcedureAppend, FsProcedureMap, FsProcedureMax, FsProcedureMin, FsProcedureSetCdr, FsProcedureVector, FsQuote, FsSet, FsSymbol, FsWrite, FsProcedureLoad } from './sexp.js'
import log from 'loglevel'
import { FsError, FsException } from './common.js'

// Environment
export class FsEnv {
  // static counter = 0

  // use {} instead of new Map() because it is bit faster on benchmarking on fib(30)
  // constructor (outer = null, vars = new Map()) {
  constructor (outer = null, vars = Object.create(null)) {
    this.outer = outer
    this.vars = vars
    // this._id = FsEnv.counter++
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
  env.set(FsSymbol.IF, FsIf)
  env.set(FsSymbol.QUOTE, FsQuote)
  env.set(FsSymbol.DEFINE, FsDefine)
  env.set(FsSymbol.SET_, FsSet)
  env.set(FsSymbol.SET_CDR_, FsProcedureSetCdr)
  env.set(FsSymbol.BEGIN, FsBegin)
  env.set(FsSymbol.LAMBDA, FsLambda)
  env.set(FsSymbol.LET, FsLet)

  // used in eval-last
  env.set(new FsSymbol('+'), FsProcedurePlus.proc)
  // also we can provide JS function as value like below.
  // env.set(new FsSymbol('+'), (list) => { return new FsNumber(list.value.map(n => n.value).reduce((a, b) => a + b, 0)) })
  env.set(new FsSymbol('-'), FsProcedureMinus.proc)
  env.set(new FsSymbol('*'), FsProcedureMultiply.proc)
  env.set(new FsSymbol('/'), FsProcedureDivide.proc)
  env.set(new FsSymbol('mod'), FsProcedureMod.proc)
  env.set(new FsSymbol('pow'), FsProcedurePow.proc)
  env.set(new FsSymbol('='), FsNumberEquals.proc)
  env.set(new FsSymbol('<'), FsProcedureLt.proc)
  env.set(new FsSymbol('<='), FsProcedureLte.proc)
  env.set(new FsSymbol('>'), FsProcedureGt.proc)
  env.set(new FsSymbol('>='), FsProcedureGte.proc)
  env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc)
  env.set(new FsSymbol('and'), FsAnd.proc)
  env.set(new FsSymbol('append'), FsProcedureAppend.proc)
  env.set(new FsSymbol('abs'), FsProcedureAbs.proc)
  env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc)
  env.set(new FsSymbol('car'), FsCar.proc)
  env.set(new FsSymbol('cdr'), FsCdr.proc)
  env.set(new FsSymbol('cons'), FsCons.proc)
  env.set(new FsSymbol('display'), FsDisplay.proc)
  env.set(new FsSymbol('eq?'), FsPredicateEq.proc)
  env.set(new FsSymbol('equal?'), FsPredicateEqual.proc)
  env.set(new FsSymbol('list'), FsList.proc)
  env.set(new FsSymbol('list?'), FsPredicateList.proc)
  env.set(new FsSymbol('load'), FsProcedureLoad.proc)
  env.set(new FsSymbol('newline'), FsNewline.proc)
  env.set(new FsSymbol('map'), FsProcedureMap.proc)
  env.set(new FsSymbol('max'), FsProcedureMax.proc)
  env.set(new FsSymbol('min'), FsProcedureMin.proc)
  env.set(new FsSymbol('null?'), FsPredicateNull.proc)
  env.set(new FsSymbol('number?'), FsPredicateNumber.proc)
  env.set(new FsSymbol('not'), FsNot.proc)
  env.set(new FsSymbol('pair?'), FsPredicatePair.proc)
  env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc)
  env.set(new FsSymbol('round'), FsProcedureRound.proc)
  env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc)
  env.set(new FsSymbol('vector'), FsProcedureVector.proc)
  env.set(new FsSymbol('vector?'), FsPredicateVector.proc)
  env.set(new FsSymbol('write'), FsWrite.proc)

  // original
  env.set(new FsSymbol('exit'), (list) => { list !== undefined && list.length > 0 ? process.exit(list.at(0).value) : process.exit(0) })
  env.set(new FsSymbol('fs-set-loglevel'), (list) => { list !== undefined && list.length === 1 ? log.setLevel(list.at(0).value) : process.exit(0) })
  env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc)

  log.setLevel(prev)
  return env
}
