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

export class FsList extends FsSExp {
  constructor (list = []) {
    super()
    this.value = list
  }

  get length () {
    return this.value.length
  }

  toString () {
    log.debug(this.value)
    return '(' + this.value.map(v => FsEvaluator.eval(v)).join(' ') + ')'
  }
}

export class FsIf extends FsList {
  static proc (list, env) {
    log.debug('fsIf')
    log.debug(list)
    const [test, conseq, alt] = list
    if (FsEvaluator.eval(test, env).value) {
      return FsEvaluator.eval(conseq, env)
    } else {
      return FsEvaluator.eval(alt, env)
    }
  }
}

export class FsLambda extends FsList {
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

export class FsProcedure {
  constructor (params, body, env) {
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
}

export class FsDefine extends FsList {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const car = list.shift()
    const cdr = list.shift()

    log.debug('car:' + car + ',cdr:' + cdr)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('DUMP-IN-DEFINE')
      console.dir(cdr)
    }

    if (!Array.isArray(car)) {
      env.set(car, FsEvaluator.eval(cdr, env))
      return car
    } else {
      throw new Error('not implemented')
    }
  }
}

export class FsQuote extends FsList {
  static proc (arg) {
    log.debug('arg.length = ' + arg.length)
    if (!Array.isArray(arg[0])) {
      return arg
    } else {
      return new FsList(arg[0])
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

export class FsNumber extends FsAtom {}

export class FsString extends FsAtom {}

export class FsSymbol extends FsAtom {}

function ensureListContainsTwo (list) {
  if (!Array.isArray(list) || list.length !== 2) {
    throw new Error('mod must take 2 arguments as list')
  }
}

export class FsOperatorPlus extends FsList {
  static proc (list) {
    return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))
  }
}

export class FsOperatorMultiply extends FsList {
  static proc (list) {
    return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
  }
}

export class FsOperatorMinus extends FsList {
  static proc (list) {
    if (list.length === 1) {
      return new FsNumber(-1 * (list[0].value))
    } else {
      return new FsNumber(list[0].value - FsOperatorPlus.proc(list.slice(1)))
    }
  }
}

export class FsOperatorDivide extends FsList {
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
export class FsOperatorMod extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list[0].value
    const divisor = list[1].value
    return new FsNumber(dividend % divisor)
  }
}

export class FsEquals extends FsList {
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

export class FsOperatorLt extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value < list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorLte extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value <= list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorGt extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value > list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsOperatorGte extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    return list[0].value >= list[1].value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsAnd extends FsList {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const [lhs, rhs] = list
    return FsEvaluator.eval(lhs, env).value === true && FsEvaluator.eval(rhs, env).value === true ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}
