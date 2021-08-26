// various S-expressions
'use strict'

import { FsEvaluator } from './evaluator.js'
import log from 'loglevel'
import { FsError, FsException } from './common.js'
import { FsEnv } from './env.js'

export class SExpFactory {
  static build (s) {
    if (!isNaN(s)) {
      return new FsNumber(+s)
    } else if (FsBoolean.isFsBooleanString(s)) {
      return FsBoolean.fromString(s)
    } else if (s.startsWith('"')) {
      const extracted = s.substring(1, s.length - 1)
      return new FsString(extracted)
    } else {
      // return new FsSymbol(s)
      return FsSymbol.intern(s)
    }
  }
}

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsError('FsSexp class can\'t be instantiated.')
    }
  }

  equals (that) {
    return undefined !== that && (this.value === that.value)
  }

  toString () {
    return this.constructor.name
  }
}

export class FsAtom extends FsSExp {
  constructor (value = null) {
    super()
    if (this.constructor === FsAtom) {
      throw new FsError('FsAtom class can\'t be instantiated.')
    }
    this._value = value
  }

  get value () {
    return this._value
  }

  toString () {
    return this._value === null ? 'null' : this._value.toString()
  }
}

export class FsIf extends FsSExp {
  static proc (list, env) {
    const [test, conseq, alt] = list
    if (FsEvaluator.eval(test, env).value) {
      return FsEvaluator.eval(conseq, env)
    } else {
      return FsEvaluator.eval(alt, env)
    }
  }
}

export class FsLambda extends FsSExp {
  static proc (list, env) {
    const params = list.shift()
    const body = list.shift()

    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('defining lambda with params:' + params + ',body:' + body)
      log.debug('--params--')
      log.debug(params)
      log.debug('--body--')
      log.debug(body)
      log.debug('------')
    }

    if (!Array.isArray(params)) {
      // single variable not suppoted
      throw new Error('non-array type arg is not implemented')
    }

    const procedure = new FsProcedure(params, body, env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨🍨')
      console.dir(procedure)
    }
    return procedure
  }
}

export class FsProcedure extends FsSExp {
  constructor (params, body, env) {
    super()
    this.params = params
    this.body = body
    this.env = env
  }

  proc (execParams) {
    const innerEnv = new FsEnv(this.env)
    if (!Array.isArray(execParams)) {
      throw new Error('arg type do not match')
    }
    for (let i = 0; i < this.params.length; i++) {
      innerEnv.set(this.params[i], execParams[i])
    }

    return FsEvaluator.eval(this.body, innerEnv)
  }

  toString () {
    return 'FsProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

export class FsLet extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    let varDefs = null
    if (Array.isArray(list) && !(Array.isArray(list[0][0]))) {
      // varDefs = [list[0]]
      throw new FsException('syntax error: bindings should have the form ((k 1) ..')
    } else {
      varDefs = list[0]
    }

    const innerEnv = new FsEnv(env)
    for (let i = 0; i < varDefs.length; i++) {
      innerEnv.set(varDefs[i][0], FsEvaluator.eval(varDefs[i][1], env))
    }

    const body = list[1]

    return FsEvaluator.eval(body, innerEnv)
  }

  toString () {
    return 'FsProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FsDefine extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const car = list.shift()
    const cdr = list.shift()

    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('car:' + car + ',cdr:' + cdr)
      log.debug('DUMP-IN-DEFINE car')
      console.dir(car)
      log.debug('DUMP-IN-DEFINE cdr')
      console.dir(cdr)
    }

    if (!Array.isArray(car)) {
      // ex)
      // (define x1 (lambda (x) (* x 2)))
      env.set(car, FsEvaluator.eval(cdr, env))
      return car
    } else {
      // ex)
      // (define (x2 x) (* x 2))
      const funcName = car.shift()
      const params = car
      const body = cdr
      const procedure = new FsProcedure(params, body, env)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('define funciton - funcName:' + funcName + ' procedure:' + procedure)
      }
      env.set(funcName, procedure)
      return funcName
    }
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FsSet extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const symbol = list.shift()
    const newValue = list.shift()

    try {
      const prev = env.find(symbol)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('set! - pref:' + prev + ' new:' + newValue)
      }
      env.set(symbol, newValue)
      return FsUndefined.UNDEFINED
    } catch (e) {
      throw new FsException('symbol must be defined before calling "set!"')
    }
  }
}

export class FsBegin extends FsSExp {
  static proc (list, env) {
    let ret = null
    for (let i = 0; i < list.length; i++) {
      ret = FsEvaluator.eval(list[i], env)
    }
    return ret
  }
}

export class FsQuote extends FsSExp {
  static proc (arg) {
    // arg ... ex) [{"_value":"'"},{"_value":"a"}]
    const quoteList = arg
    if (Array.isArray(quoteList[0])) {
      const innerList = quoteList[0]
      if (FsSymbol.SINGLE_QUOTE.equals(innerList[0])) {
        log.debug('returning FsList starting with FsSybol.SINGLE_QUOTE')
        return new FsList([innerList[0], FsQuote.proc(innerList.slice(1))])
      } else {
        log.debug('returning FsList')
        return new FsList(innerList)
      }
    } else {
      return new FsSingleItem(arg)
    }
  }
}

export class FsBoolean extends FsAtom {
  static TRUE_ = new FsBoolean(true)
  static FALSE_ = new FsBoolean(false)

  static get TRUE () { return FsBoolean.TRUE_ }
  static get FALSE () { return FsBoolean.FALSE_ }

  static isFsBooleanString (s) {
    return (s === '#t' || s === '#f')
  }

  static fromString (s) {
    if (s === '#t') {
      return FsBoolean.TRUE
    } else if (s === '#f') {
      return FsBoolean.FALSE
    }
  }

  toString () {
    return this.value ? '#t' : '#f'
  }
}

export class FsNumber extends FsAtom {
  toString () {
    return this.value
  }

  equals (target) {
    return this.value === target.value
  }
}

export class FsString extends FsAtom {
  toString () {
    return '"' + this.value + '"'
  }
}

export class FsSymbol extends FsAtom {
  static IF = new FsSymbol('if')
  static QUOTE = new FsSymbol('quote')
  static SINGLE_QUOTE = new FsSymbol('\'')
  static DEFINE = new FsSymbol('define')
  static SET_ = new FsSymbol('set!')
  static BEGIN = new FsSymbol('begin')
  static LAMBDA = new FsSymbol('lambda')
  static LET = new FsSymbol('let')
  static intern (str) {
    switch (str) {
      case 'if':
        return this.IF
      case 'quote':
        return this.QUOTE
      case '\'':
        return this.SINGLE_QUOTE
      case 'define':
        return this.DEFINE
      case 'set!':
        return this.SET_
      case 'begin':
        return this.BEGIN
      case 'lambda':
        return this.LAMBDA
      case 'let':
        return this.LET
      default:
        return new FsSymbol(str)
    }
  }
}

export class FsUndefined extends FsAtom {
  static UNDEFINED_ = new FsUndefined()

  static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

  toString () {
    return '#undefined'
  }
}

function ensureListContains (list, length) {
  if (!Array.isArray(list) || list.length !== length) {
    throw new Error('this procedure must take ' + length + ' argument(s) as list')
  }
}

function ensureListContainsTwo (list) {
  ensureListContains(list, 2)
}

function ensureListContainsOne (list) {
  ensureListContains(list, 1)
}

export class FsOperatorPlus extends FsSExp {
  static proc (list) {
    return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))
  }
}

export class FsOperatorMultiply extends FsSExp {
  static proc (list) {
    return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
  }
}

export class FsOperatorMinus extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      return new FsNumber(-1 * (list[0].value))
    } else {
      return new FsNumber(list[0].value - FsOperatorPlus.proc(list.slice(1)))
      // for the performance, use lines below. it may be bit faster.
      //
      // let buf = list[0].value
      // for (let i = 1; i < list.length; i++) {
      //   buf -= list[i]
      // }
      // return new FsNumber(buf)
    }
  }
}

export class FsOperatorDivide extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      // TODO: support rational number
      if (list[0].value !== 0) {
        return list[0]
      } else {
        throw new FsException('divide by 0')
      }
    } else {
      const divisor = FsOperatorMultiply.proc(list.slice(1))
      if (divisor.value !== 0) {
        return new FsNumber(list[0].value / divisor.value)
      } else {
        throw new FsException('divide by 0')
      }
    }
  }
}

export class FsOperatorMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list[0].value
    const divisor = list[1].value
    return new FsNumber(dividend % divisor)
  }
}

export class FsEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const [lhs, rhs] = list
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

export class FsOperatorLt extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value < list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorLte extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value <= list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorGt extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value > list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorGte extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value >= list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsAnd extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const [lhs, rhs] = list
    return lhs === FsBoolean.TRUE && rhs === FsBoolean.TRUE ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsNot extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const target = list[0]
    if (target instanceof FsBoolean) {
      return target.value ? FsBoolean.FALSE : FsBoolean.TRUE
    } else {
      return FsBoolean.FALSE
    }
  }
}

export class FsWrite extends FsSExp {
  static proc (list) {
    process.stdout.write(list.map(s => s.value).join(' '))
    return FsUndefined.UNDEFINED
  }
}

export class FsNewline extends FsSExp {
  static proc (list) {
    console.log()
    return FsUndefined.UNDEFINED
  }
}

export class FsDisplay extends FsSExp {
  static proc (list) {
    process.stdout.write(list.map(s => s.value).join(' '))
    return FsUndefined.UNDEFINED
  }
}

export class FsValue {}
export class FsList extends FsValue {
  constructor (value) {
    super()
    this.value = value
    log.debug('ctor FsList called with:' + value)
  }

  get length () {
    return this.value.length
  }

  static proc (arg) {
    return new FsList(arg)
  }

  toString () {
    if (FsSymbol.SINGLE_QUOTE.equals(this.value[0])) {
      return '\'' + this.value[1].toString()
    } else {
      return '(' + this.value.map(v => v.toString()).join(' ') + ')'
    }
  }
}

export class FsSingleItem extends FsValue {
  constructor (value) {
    super()
    this.value_ = value
    log.debug('ctor FsSingleItem called with:' + value)
  }

  toString () {
    return this.value_.toString()
  }
}

export class FsPredicateNull extends FsSExp {
  static proc (list) {
    return list[0] instanceof FsList && (list[0]).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateBoolean extends FsSExp {
  static proc (list) {
    return list[0] instanceof FsBoolean ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateList extends FsSExp {
  static proc (list) {
    return list[0] instanceof FsList ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}
