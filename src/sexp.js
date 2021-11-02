// various S-expressions
'use strict'

import log from 'loglevel'

import { FsError, FsException } from './common.js'
import { FsBoolean, FsList, FsNumber, FsPair, FsString, FsVector, isProperList } from './datatypes.js'
import { FsEnv } from './env.js'
import { FsEvaluator } from './evaluator.js'
import { FsAtom, FsSExp } from './sexpbase.js'
import { ensureListContainsOne, ensureListContainsTwo } from './sexputils.js'
import { FsSymbol } from './symbol.js'

export class FssIf extends FsSExp {
  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  static proc (list, env) {
    throw new FsError('do not call me.')
  }
}

export class FssLambda extends FsSExp {
  static proc (list, env) {
    const params = list.at(0)

    // (lambda <formals> body)
    // <formals> could be 3 types.
    // case 1. (<v1> <v2>, ...) ; a fixed number of arguments
    // case 2. <v> ; any number of arguments
    // case 3. (<v1> <v2> ... <vn> . <vn+1>) ; takes n or more arguments

    const body = list.slice(1)
    const procedure = new FssDefinedProcedure(params, body, env)
    return procedure
  }
}

export class FssDefinedProcedure extends FsSExp {
  constructor (params, body, env) {
    super()
    this.params = params
    this.body = body
    this.env = env

    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('ctor. FssDefinedProcedure with params:' + params + ',body:' + body)
      log.debug('--params--')
      log.debug(params)
      log.debug('--body--')
      log.debug(body)
      log.debug('------')
    }
  }

  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  proc (execParams) {
    // throw new FsError('do not call me.')

    // These lines are used to expand macro in expand().
    // TODO: try to unify this and logic in eval()
    const newEnv = new FsEnv(this.env)
    newEnv.set(this.params, execParams)
    return FsEvaluator.eval(this.body.at(0), newEnv)
  }

  toString () {
    return 'FssDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }

  get type () {
    return 'FssDefinedprocedure'
  }
}

export class FslsCond extends FsSExp {
  static proc (list, env) {
    const clauses = list
    const lastClause = clauses.at(list.length - 1)

    // else-clause
    const hasElseClause = (lastClause.at(0) === FsSymbol.ELSE)

    const loopLength = hasElseClause ? clauses.length - 1 : clauses.length
    for (let i = 0; i < loopLength; i++) {
      const clause = clauses.at(i)
      const test = clause.at(0)
      const testResult = FsEvaluator.eval(test, env)
      if (testResult === FsBoolean.TRUE) {
        let ret = null
        for (let j = 1; j < clauses.at(i).length; j++) {
          if (clauses.at(j) === FsSymbol.TEST_IS_TRUE_THEN) {
            continue
          } else {
            ret = FsEvaluator.eval(clause.at(j), env)
          }
        }
        return ret
      }
    }

    if (hasElseClause) {
      let ret = null
      for (let j = 1; j < lastClause.length; j++) {
        ret = FsEvaluator.eval(lastClause.at(j), env)
      }
      return ret
    }

    return FsUndefined.UNDEFINED
  }
}

export class FslsNamedLet extends FsSExp {
  static proc (list, env) {
    const procName = list.at(0)
    const varDefs = list.at(1)
    const body = list.at(2)

    const varMap = new Map()
    const vars = []
    for (let i = 0; i < varDefs.length; i++) {
      const tmpEnv = new FsEnv(env)
      varMap.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), tmpEnv))
      vars.push(varDefs.at(i).at(0))
    }

    const innerEnv = new FsEnv(env)
    for (let i = 0; i < vars.length; i++) {
      innerEnv.set(vars[i], varMap.get(vars[i]), true)
    }

    const paramList = []
    paramList.push(...vars)

    const procedure = new FssDefinedProcedure(new FsList(paramList), new FsList([body]), innerEnv)
    innerEnv.set(procName, procedure)

    return FsEvaluator.eval(body, innerEnv)
  }
}

export class FslsLet extends FsSExp {
  static proc (list, env) {
    let varDefs = null
    if (list.at(0) instanceof FsList && list.at(0).at(0) instanceof FsList) {
      // let
      varDefs = list.at(0)
    } else if (list.at(0) instanceof FsSymbol && list.at(1) instanceof FsList) {
      return FslsNamedLet.proc(list, env)
    } else {
      throw new FsException('syntax error: bindings should have the form ((k 1) .., or form (variable ((k 1) ...')
    }

    const varMap = new Map()
    const vars = []
    for (let i = 0; i < varDefs.length; i++) {
      const tmpEnv = new FsEnv(env)
      varMap.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), tmpEnv))
      vars.push(varDefs.at(i).at(0))
    }

    const innerEnv = new FsEnv(env)
    for (let i = 0; i < vars.length; i++) {
      innerEnv.set(vars[i], varMap.get(vars[i]))
    }

    let ret = null
    for (let i = 1; i < list.length; i++) {
      const body = list.at(i)
      ret = FsEvaluator.eval(body, innerEnv)
    }

    return ret
  }

  toString () {
    return 'FssDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

export class FslsLetAsterisk extends FsSExp {
  static proc (list, env) {
    let varDefs = null
    if (Array.isArray(list) && !(Array.isArray(list.at(0).at(0)))) {
      throw new FsException('syntax error: bindings should have the form ((k 1) ..')
    } else {
      varDefs = list.at(0)
    }

    const innerEnv = new FsEnv(env)
    for (let i = 0; i < varDefs.length; i++) {
      innerEnv.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), env))
    }

    let ret = null
    for (let i = 1; i < list.length; i++) {
      const body = list.at(i)
      ret = FsEvaluator.eval(body, innerEnv)
    }

    return ret
  }

  toString () {
    return 'FssDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

export class FslsLetRecAsterisk extends FsSExp {
  static proc (list, env) {
    let varDefs = null
    if (Array.isArray(list) && !(Array.isArray(list.at(0).at(0)))) {
      throw new FsException('syntax error: bindings should have the form ((k 1) ..')
    } else {
      varDefs = list.at(0)
    }

    const emptyEnv = new FsEnv(env)
    emptyEnv.clearVars()
    for (let i = 0; i < varDefs.length; i++) {
      emptyEnv.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), emptyEnv))
    }

    let ret = null
    for (let i = 1; i < list.length; i++) {
      const body = list.at(i)
      ret = FsEvaluator.eval(body, emptyEnv)
    }

    return ret
  }

  toString () {
    return 'FssDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FssDefine extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const car = list.at(0)

    if (!(car instanceof FsList)) {
      // e.g.
      // (define x1 (lambda (x) (* x 2)))
      const cdr = list.at(1)
      env.set(car, FsEvaluator.eval(cdr, env))
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('define symbol - symbol:' + car + ' value:' + cdr)
      }
      return car
    } else {
      // e.g.
      // (define (x2 x) (* x 2))
      // is expanded to (define x2 (lambda (x2) (* x 2))) in the expander.
      throw new Error('System Error.')
    }
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FssSet extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const symbol = list.at(0)
    const newValue = list.at(1)

    try {
      const prev = env.find(symbol)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('set! - prev:' + prev + ' new:' + newValue)
      }
      const v = FsEvaluator.eval(newValue, env)
      env.set(symbol, v)
      return v
    } catch (e) {
      throw new FsException('symbol must be defined before calling "set!"')
    }
  }
}

export class FssBegin extends FsSExp {
  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  static proc (list, env) {
    throw new FsError('do not call me.')
    // let ret = null
    // for (let i = 0; i < list.length; i++) {
    //   ret = FsEvaluator.eval(list[i], env)
    // }
    // return ret
  }
}

export class FsUndefined extends FsAtom {
  static UNDEFINED_ = new FsUndefined()

  static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

  toString () {
    return '#undefined'
  }
}

// in scheme,
// '=' checks two numbers are equal,
// eqv?, eq are described in 6.1 https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-9.html#%_sec_6.1
export class FsEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    if (lhs instanceof FsNumber && rhs instanceof FsNumber) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs.toString() === rhs.toString() ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}

export class FslsAnd extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      const lhs = list.at(0)
      const rhs = list.at(1)
      return lhs === FsBoolean.TRUE && rhs === FsBoolean.TRUE ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (list.length === 1) {
      return list.at(0)
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list.at(0) !== list.at(i)) {
          return FsBoolean.FALSE
        }
      }
      return FsBoolean.TRUE
    }
  }
}

export class FslsDo extends FsSExp {
  static proc (list, env) {
    const newEnv = new FsEnv(env)
    const varList = list.at(0)
    const symbolToStepMap = new Map()
    const symbols = []
    for (let i = 0; i < varList.length; i++) {
      // init
      const def = varList.at(i)
      const symbol = def.at(0)
      const init = FsEvaluator.eval(def.at(1), newEnv)

      const stepExp = def.length === 2 ? def.at(0) : def.at(2)
      newEnv.set(symbol, init)
      symbols[i] = symbol
      symbolToStepMap.set(symbol, stepExp)
    }

    const testExp = list.at(1).at(0)
    // const retExps = list.at(1).slice(1)
    const commands = list.slice(2)

    while (FsEvaluator.eval(testExp, newEnv) === FsBoolean.FALSE) {
      // command
      for (let i = 0; i < commands.length; i++) {
        FsEvaluator.eval(commands.at(i), newEnv)
      }
      // step
      const nextValueMap = new Map()
      for (let i = 0; i < symbols.length; i++) {
        const v = FsEvaluator.eval(symbolToStepMap.get(symbols[i]), newEnv)
        nextValueMap.set(symbols[i], v)
      }

      nextValueMap.forEach((value, key) => {
        newEnv.set(key, value)
      })
    }

    const retExps = list.at(1).slice(1)
    const buf = []
    for (let i = 0; i < retExps.length; i++) {
      buf[i] = FsEvaluator.eval(retExps.at(i), newEnv)
    }

    if (retExps.length === 1) {
      return buf[0]
    } else {
      return new FsList(buf)
    }
  }
}

export class FslpNot extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const target = list.at(0)
    if (target instanceof FsBoolean) {
      return target.value ? FsBoolean.FALSE : FsBoolean.TRUE
    } else {
      return FsBoolean.FALSE
    }
  }
}

export class FspSymbolToString extends FsSExp {
  static proc (list) {
    return new FsString(list.at(0).value)
  }
}

export class FslpLength extends FsSExp {
  static proc (list) {
    if (!isProperList(list.at(0))) {
      throw new FsException('arg must be proper list but got ' + list)
    }
    if (list.at(0) instanceof FsPair) {
      return new FsNumber(list.at(0).length)
    } else if (list instanceof FsList && list.at(0) instanceof FsList) {
      return new FsNumber(list.at(0).value.length)
    } else {
      throw new Error('not implemented')
    }
  }
}

export class FslpMap extends FsSExp {
  static proc (list, env) {
    const p = list.at(0)
    const body = list.at(1)
    const ret = []
    for (let i = 0; i < body.length; i++) {
      ret.push(FsEvaluator.eval(new FsList([p, body.at(i)]), env))
    }
    return new FsList(ret)
  }
}

export class FslpAppend extends FsSExp {
  static proc (list) {
    const newList = []
    for (let j = 0; j < list.length; j++) {
      for (let i = 0; i < list.at(j).length; i++) {
        newList.push(list.at(j).at(i))
      }
    }
    return new FsList(newList)
  }
}

export class FspSetCdr extends FsSExp {
  static proc (list, env) {
    const evaledCurrent = FsEvaluator.eval(list.at(0), env)
    if (evaledCurrent instanceof FsPair) {
      const np = new FsPair(evaledCurrent.car, list.at(1))
      env.set(list.at(0), np)
    } else if (evaledCurrent instanceof FsList) {
      const np = new FsPair(evaledCurrent.at(0), list.at(1))
      env.set(list.at(0), np)
    }
    // const target = list.at(0)
    // const newCdr = list.at(1)
    // target.value.at(0), newCdr
    return FsUndefined.UNDEFINED
  }
}

export class FspLastPair extends FsSExp {
  static proc (list, env) {
    if (list.at(0).type === 'fspair') {
      let current = list.at(0)
      let hasMore = current.cdr !== undefined && current.cdr.type === 'fspair'
      while (hasMore) {
        const next = current.cdr
        hasMore = next.cdr !== undefined && next.cdr.type === 'fspair'
        if (hasMore) {
          current = current.at(0).cdr
        } else {
          current = next
        }
      }
      return current
    } else {
      return (list.at(0)).at(list.at(0).length - 1)
    }
  }
}

// returns memory usage of called time.
//
// only works with Node
export class FsPeekMemoryUsage extends FsSExp {
  static proc (list) {
    const m = process.memoryUsage()
    return new FsString(JSON.stringify(m))
  }
}

export class FspCar extends FsSExp {
  static proc (arg) {
    const target = arg.at(0)
    if (target instanceof FsPair) {
      return target.car
    } else if (target instanceof FsList) {
      if (target === FsList.EMPTY) {
        throw new FsException('Syntax Error : cannot call car with EMPTY list')
      }
      return target.at(0)
    } else {
      throw new FsException('Syntax Error : cannot call car with arg ' + arg)
    }
  }
}

export class FspCdr extends FsSExp {
  static proc (arg) {
    const target = arg.at(0)
    if (target instanceof FsPair) {
      return target.cdr
    } else if (target instanceof FsList) {
      if (target === FsList.EMPTY) {
        throw new FsException('Syntax Error : cannot call cdr with EMPTY list')
      }
      return new FsList(target.value.slice(1))
    } else {
      throw new FsException('Syntax Error : cannot call cdr with arg ' + arg)
    }
  }
}

export class FspCons extends FsSExp {
  static proc (arg) {
    ensureListContainsTwo(arg)
    // TODO dot pair
    if (arg.at(1) instanceof FsList) {
      return new FsList([arg.at(0)].concat(arg.at(1).value))
    } else {
      return new FsPair(arg.at(0), arg.at(1))
    }
  }
}

export class FslpList {
  static proc (arg) {
    return arg.length === 0 ? FsList.EMPTY : new FsList(arg.value)
  }
}

export class FssQuasiQuote {
  static procInner (arg, env) {
    if (!(arg instanceof FsList || arg instanceof FsVector)) {
      return arg
    } else {
      // arg is FsList or FsVector or FsPair
      const t = arg.at(0)
      if (t === FsSymbol.COMMA || t === FsSymbol.UNQUOTE || t === FsSymbol.COMMA_FOLLOWED_BY_AT) {
        const newEnv = new FsEnv(env)
        newEnv.increaseUnquoteDepth()
        if (newEnv.isSameQuasiquoteAndUnquoteLevel()) {
          // eval and replace
          return FsEvaluator.eval(arg.at(1), newEnv)
        } else {
          // do not eval, preserve unquote
          const buf = []
          buf.push(t)
          buf.push(this.procInner(arg.at(1), newEnv))
          return new FsList(buf)
        }
      } else {
        let nextEnv = null
        if (t === FsSymbol.QUASIQUOTE || t === FsSymbol.BACK_QUOTE) {
          nextEnv = new FsEnv(env)
          env.increaseQuasiquoteDepth()
        } else {
          nextEnv = env
        }

        // pair
        if (arg instanceof FsPair) {
          let currentPair = arg

          const retPairRoot = new FsPair()
          let retPairTail = retPairRoot
          retPairTail.car = this.procInner(currentPair.car, nextEnv)

          do {
            currentPair = currentPair.cdr
            const newPair = new FsPair()
            retPairTail.cdr = newPair
            // treat ,@
            // newPair.car = this.procInner(currentPair.car, nextEnv)
            const t = currentPair.car
            if (t instanceof FsList && t.length > 1 && t.at(0) === FsSymbol.COMMA_FOLLOWED_BY_AT) {
              const proced = this.procInner(t, nextEnv)
              if (proced instanceof FsList && proced.length === 0) {
                // edge case
                // do not append ()
              } else {
                newPair.car = proced
                retPairTail = newPair
              }
            } else {
              newPair.car = this.procInner(currentPair.car, nextEnv)
              retPairTail = newPair
            }
          } while (currentPair.cdr instanceof FsPair)
          retPairTail.cdr = this.procInner(currentPair.cdr, nextEnv)

          return retPairRoot
        }

        // list and vector
        const buf = []
        for (let i = 0; i < arg.length; i++) {
          const t = arg.at(i)
          if (t instanceof FsList && t.length > 1 && t.at(0) === FsSymbol.COMMA_FOLLOWED_BY_AT) {
            const proced = this.procInner(t, nextEnv)
            buf.push(...proced.value)
          } else {
            buf.push(this.procInner(t, nextEnv))
          }
        }

        if (arg instanceof FsList) {
          return new FsList(buf)
        } else if (arg instanceof FsVector) {
          return new FsVector(buf)
        } else {
          throw new Error('unsupported datatype' + arg)
        }
      }
    }
  }

  static proc (arg, env) {
    // when we find "`", increase quote depth
    const quotedEnv = new FsEnv(env)
    quotedEnv.increaseQuasiquoteDepth()
    return this.procInner(arg, quotedEnv)
  }
}
export class FssUnquote {
  static proc (arg, env) {
    log.debug('UNQUOTE>>>>>' + arg)
    throw new Error('came here!')
  }
}

export class FsExceptionForCallCc {
  constructor () {
    this.retVal = null
  }
}
export class FspCallCc {
  static proc (arg, env) {
    const ball = new FsExceptionForCallCc()
    const newEnv = new FsEnv(env)
    const s = new FsSymbol(FspGensym.proc(null, newEnv))
    ball.forSymbol = s
    try {
      // a function that is invoked when the given symbol is used.
      const throwBack = (arg, env) => {
        ball.retVal = arg.at(0)
        throw ball
      }
      // s.proc = throwBack // do not need to set proc like this because it is lookuped from Symbol Table
      newEnv.set(s, throwBack)
      const sexp = new FsList([arg.at(0), s])
      return FsEvaluator.eval(sexp, newEnv)
    } catch (e) {
      if (e instanceof FsExceptionForCallCc && e.forSymbol === s) {
        // Yes, I passed this ball to the procedure and it thrown back now.
        return e.retVal
      } else {
        // I don't care thrown error here. It may be FsExceptionForCallCc or not.
        throw e
      }
    }
  }
}

export class FspGensym {
  static id = 100
  static proc (arg, env) {
    FspGensym.id++
    const v = 'FSG_' + FspGensym.id
    const s = new FsSymbol(v)
    env.set(s, null)
    return s
  }
}
