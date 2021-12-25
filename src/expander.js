'use strict'
import log from 'loglevel'

import { FsError, FsException } from './common.js'
import { FsList, FsPair } from './datatypes.js'
import { FsEvaluator } from './evaluator.js'
import { FsUndefined } from './sexp.js'
import { FsSymbol } from './symbol.js'

export class FsExpander {
  constructor (env) {
    this.macroTable = new Map()
    this.globalEnv = env
  }

  // pre process sexp
  expand (sexpList, atToplevel = false) {
    if (sexpList === undefined) {
      throw new FsError('ERROR: "undefined" was passed to expand() ')
    }
    if (!Array.isArray(sexpList)) {
      throw new FsError('ERROR: should pass array to expand() ')
    }

    const ret = sexpList.map(sexp => this.expandInner(sexp, atToplevel))
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug(ret.length)
      for (let i = 0; i < ret.length; i++) {
        log.debug('expanded : ' + i + ' : >>> ' + ret[i] + ' <<<')
      }
      log.debug('------')
      log.debug(JSON.stringify(ret, null, 2))
      log.debug('------')
    }
    return ret
  }

  expandInner (sexp, atToplevel = false) {
    if (sexp === undefined) {
      throw new FsError('ERROR: "undefined" was passed to expandInner() ')
    }
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug(JSON.stringify(sexp, null, 2))
    }
    if (!(sexp instanceof FsList)) {
      // it passes "null".
      return sexp
    // } if (Array.isArray(sexp) && sexp.length === 0) {
    //   return FsList.EMPTY
    } else if (sexp.at(0) === FsSymbol.IF) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed if:' + sexp)
      }
      if (sexp.length === 3) {
        // ex. [if #t 1] => [if #t 1 null]
        sexp.push(FsUndefined.UNDEFINED)
      }
      return new FsList(sexp.value.map(sexp => this.expandInner(sexp)))
    } else if (sexp.at(0) === FsSymbol.BEGIN) {
      if (sexp.length === 1) {
        return FsUndefined.UNDEFINED
      }
      const buf = []
      for (let i = 0; i < sexp.length; i++) {
        buf.push(this.expandInner(sexp.at(i), atToplevel))
      }
      return new FsList(buf)
    } else if (sexp.at(0) instanceof FsSymbol && (
      sexp.at(0).value === '<' ||
      sexp.at(0).value === '<=' ||
      sexp.at(0).value === '>' ||
      sexp.at(0).value === '>='
    )) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed :' + sexp)
      }
      return new FsList(sexp.value.map(sexp => this.expandInner(sexp)))
    } else if (sexp.at(0) instanceof FsSymbol && sexp.at(0).value === 'set!') {
      if (sexp.length !== 3) {
        throw new FsException('Syntax Error: malformed :' + sexp)
      }
      return sexp
    } else if (sexp.at(0) === FsSymbol.DEFINE || sexp.at(0) === FsSymbol.DEFINE_MACRO) {
      log.debug('change the form of define: ' + sexp)
      if (!(sexp.at(1) instanceof FsList)) {
        // e.g.
        // (define x1 (lambda (x) (* x 2)))
        // const proc = sexp.at(2)
        // env.set(car, FsEvaluator.eval(cdr, env))
        // if (log.getLevel() <= log.levels.DEBUG) {
        //   log.debug('define symbol - symbol:' + car + ' value:' + cdr)
        // }
        // return car

        if (sexp.at(0) === FsSymbol.DEFINE_MACRO) {
          // parse macro and append its name to macro table
          // TODO: check it is called in top-level, repl or begin in top-level
          if (!atToplevel) {
            throw new FsException('Syntax Error: define-macro should be at top level.')
          }
          const proc = FsEvaluator.eval(sexp.at(2), this.globalEnv)
          const procName = sexp.at(1)
          this.macroTable.set(procName.value, proc) // TODO:multpile bodies

          return FsUndefined.UNDEFINED
        }

        return sexp
      } else {
        // e.g.
        // (define (x2 x) (* x 2))
        const funcName = sexp.at(1).type === 'fslist'
          ? sexp.at(1).at(0)
          : sexp.at(1).car
        // check var arg case : e.g. (define (add . things))
        const params = sexp.at(1).type === 'fslist'
          ? sexp.at(1).slice(1)
          : sexp.at(1).cdr instanceof FsPair ? sexp.at(1).cdr : new FsPair(FsList.EMPTY, sexp.at(1).cdr)
        const body = sexp.at(2) // TODO: multiple bodies
        const lambdaSExp = new FsList([FsSymbol.LAMBDA, params, body])
        const defineSExp = new FsList([FsSymbol.DEFINE, funcName, lambdaSExp])
        return this.expandInner(defineSExp, atToplevel)
      }
    } else if (sexp.at(0) instanceof FsSymbol && this.macroTable.has(sexp.at(0).value)) {
      const m = this.macroTable.get(sexp.at(0).value) // get defined procedure
      const proced = m.proc(sexp.slice(1)) // eval it
      return this.expandInner(proced, atToplevel) // then place the result here
    } else {
      return sexp
    }
  }
}
