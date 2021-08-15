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
      return new FsSymbol(s)
    }
  }
}

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsException('FsSexp class can\'t be instantiated.')
    }
  }

  toString () {
    return this.constructor.name
  }
}

export class FsAtom extends FsSExp {
  constructor (value = null) {
    super()
    if (this.constructor === FsAtom) {
      throw new FsException('FsAtom class can\'t be instantiated.')
    }
    this._value = value
  }

  get value () {
    return this._value
  }

  set value (v) {
    this._value = v
  }

  toString () {
    return this._value === null ? 'null' : this._value.toString()
  }
}

export class FsIf extends FsSExp {
  static proc (list, env) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('fsIf')
      log.debug(list)
    }
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
      throw new FsError('symbol must be defined before calling "set!"')
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
    if (!Array.isArray(arg)) {
      return new FsValue(arg)
    } else {
      return new FsValue(arg[0])
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

  static fromValue (v) {
    return v ? FsBoolean.TRUE : FsBoolean.FALSE
  }

  toString () {
    return this.value ? '#t' : '#f'
  }
}

export class FsNumber extends FsAtom {
  toString () {
    return this.value
  }
}

export class FsString extends FsAtom {
  toString () {
    return '"' + this.value + '"'
  }
}

export class FsSymbol extends FsAtom {}

export class FsUndefined extends FsAtom {
  static UNDEFINED_ = new FsUndefined()

  static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

  toString () {
    return '#undefined'
  }
}

function ensureListContainsTwo (list) {
  if (!Array.isArray(list) || list.length !== 2) {
    throw new Error('mod must take 2 arguments as list')
  }
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
      if (list[0].value !== 0) {
        return list[0]
      } else {
        throw new FsError('divide by 0')
      }
    } else {
      const divisor = FsOperatorMultiply.proc(list.slice(1))
      if (divisor.value !== 0) {
        return new FsNumber(list[0].value / divisor.value)
      } else {
        throw new FsError('divide by 0')
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
  static proc (param, env) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('FsEquals')
      console.dir(param)
    }
    if (!Array.isArray(param) || param.length !== 2) {
      throw new Error('equals must take 2 arguments as list')
    }
    const [lhs, rhs] = param
    return FsEvaluator.eval(lhs, env).toString() === FsEvaluator.eval(rhs, env).toString() ? FsBoolean.TRUE : FsBoolean.FALSE
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
  static proc (list, env) {
    ensureListContainsTwo(list)
    const [lhs, rhs] = list
    return FsEvaluator.eval(lhs, env) === FsBoolean.TRUE && FsEvaluator.eval(rhs, env) === FsBoolean.TRUE ? FsBoolean.TRUE : FsBoolean.FALSE
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

export class FsValue extends FsSExp {
  constructor (value) {
    super()
    this.value_ = value
  }

  get length () {
    if (this.value_ instanceof Array) {
      return this.value_.length
    } else {
      return 1
    }
  }

  evaled () {
    if (this.value_ instanceof Array) {
      return this.value_.map(v => FsEvaluator.eval(v))
    } else {
      return FsEvaluator.eval(this.value_)
    }
  }

  toString () {
    if (this.value_ instanceof Array) {
      return '(' + this.value_.map(v => FsEvaluator.eval(v)).join(' ') + ')'
    } else {
      return FsEvaluator.eval(this.value_)
    }
  }
}
