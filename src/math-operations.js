import { FsException } from './common.js'
import {
  canBeTreatedAsComplex,
  canBeTreatedAsRational,
  canBeTreatedAsReal,
  FsBoolean,
  FsComplex,
  FsInteger,
  FsList,
  FsNotANumberException,
  FsNumber,
  FsRational,
  FsReal,
  FsString,
  gcd,
  lcm
} from './datatypes.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsOne, ensureListContainsTwo } from './sexputils.js'

// functions of various math-algorithms

// find rational number representation by "Stern-Brocot Tree"
export function findRationalReps (realValue, epsilon = 0.0001, exact = true) {
  let a = 0
  let b = 1
  let c = 1
  let d = 0
  let bestError = realValue
  let numerator = 0
  let denominator = 1
  while (bestError > epsilon) {
    const mid = (a + c) / (b + d)

    if (bestError > Math.abs(realValue - mid)) {
      bestError = Math.abs(realValue - mid)
      numerator = a + c
      denominator = b + d
    }

    if (realValue < mid) {
      ;[c, d] = [a + c, b + d]
    } else {
      ;[a, b] = [a + c, b + d]
    }
  }
  return new FsRational(numerator, denominator, exact)
}

// internal functions

function checkArgRepresentsAnInteger (n) {
  if (!(n instanceof FsInteger || (n instanceof FsReal && n.isInteger()))) {
    throw new FsException('arg must be an integer ' + n)
  }
}

/**
 * an util function that takes 1 parameter and applyes a given function
 *
 * @param {*} JavaScript function
 * @param {*} a FsInteger, FsRational or FsReal
 * @returns {any} FsInteger or FsReal
 */
// used by ceil, floor, truncate, round
function realParamWithIntReturnUnaryOperation (func, a) {
  if (a instanceof FsInteger || a instanceof FsRational) {
    return new FsInteger(func(a.value))
  } else {
    if (!(a instanceof FsReal)) {
      throw new FsException('arg must be a real or integer value but got ' + a)
    }
    return new FsReal(func(a.value))
  }
}

function realParameterUnaryOperation (func, a) {
  // TODO: remove FsNumber after adding datatype oeprations.
  if (!canBeTreatedAsReal(a)) {
    throw new FsException('arg must be a real but got ' + a)
  }
  return new FsReal(func(a.value))
}

function realParameterBinaryOperation (func, a, b) {
  if (a instanceof FsInteger && b instanceof FsInteger) {
    return new FsInteger(func(a.value, b.value))
  } else {
    // TODO: remove FsNumber after adding datatype oeprations.
    if (
      !(a instanceof FsReal || a instanceof FsInteger || a instanceof FsNumber)
    ) {
      throw new FsNotANumberException(a)
    }
    // TODO: remove FsNumber after adding datatype oeprations.
    if (
      !(b instanceof FsReal || b instanceof FsInteger || b instanceof FsNumber)
    ) {
      throw new FsNotANumberException(b)
    }
    return new FsReal(func(a.value, b.value))
  }
}

// exported operators

export class FslpAbs extends FsSExp {
  static proc (list) {
    if (list.at(0) instanceof FsInteger) {
      return new FsInteger(Math.abs(list.at(0).value))
    } else if (list.at(0) instanceof FsRational) {
      return new FsRational(
        Math.abs(list.at(0).numerator),
        Math.abs(list.at(0).denominator)
      )
    } else if (list.at(0) instanceof FsReal) {
      return new FsReal(Math.abs(list.at(0).value))
    } else if (list.at(0) instanceof FsComplex) {
      return new FsReal(list.at(0).abs())
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}

export class FspAcos extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsReal(p)) {
      return new FsReal(Math.acos(p.value))
    } else if (p instanceof FsComplex) {
      const insideSqrt = new FsComplex(1, 0).subtract(p.multiply(p))
      const insideLog = p.add(new FsComplex(0, 1).multiply(insideSqrt.sqrt()))
      return new FsComplex(0, 1)
        .multiply(insideLog.log())
        .multiply(new FsReal(-1))
    } else {
      throw new FsNotANumberException(p)
    }
  }
}

export class FspAngle extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsReal(p)) {
      return new FsReal(0)
    } else if (p instanceof FsComplex) {
      return p.arg()
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}
export class FspAsin extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsReal(p)) {
      return new FsReal(Math.asin(p.value))
    } else if (p instanceof FsComplex) {
      const insideSqrt = new FsComplex(1, 0).subtract(p.multiply(p))
      const insideLog = new FsComplex(0, 1).multiply(p).add(insideSqrt.sqrt())
      return new FsComplex(0, 1)
        .multiply(insideLog.log())
        .multiply(new FsReal(-1))
    } else {
      throw new FsNotANumberException(p)
    }
  }
}

export class FspAtan extends FsSExp {
  static calcComplex (p) {
    const insideSqrt = new FsReal(1.0).devide(
      new FsComplex(1, 0).add(p.multiply(p))
    )
    const insideLog = new FsReal(1.0)
      .add(new FsComplex(0, 1).multiply(p))
      .multiply(insideSqrt.sqrt())
    return new FsComplex(0, 1)
      .multiply(insideLog.log())
      .multiply(new FsReal(-1))
  }

  static proc (list) {
    if (list.length === 1) {
      const p = list.at(0)
      if (canBeTreatedAsReal(p)) {
        return new FsReal(Math.atan(p.value))
      } else if (p instanceof FsComplex) {
        return FspAtan.calcComplex(p)
      } else {
        throw new FsNotANumberException(p)
      }
    } else if (list.length === 2) {
      return FspAtan.calcComplex(
        new FsComplex(list.at(0).value, list.at(1).value)
      )
    } else {
      throw new FsException(
        'Syntax error: atan requires 1 or 2 args but got ' + list.length
      )
    }
  }
}
export class FspCeiling extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.ceil, t)
  }
}

export class FspCos extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    if (canBeTreatedAsReal(list.at(0))) {
      return realParameterUnaryOperation(Math.cos, list.at(0))
    } else if (list.at(0) instanceof FsComplex) {
      const pz = list.at(0)
      const pr = pz.real
      const pi = pz.imaginary
      return new FsComplex(
        Math.cos(pr) * Math.cosh(pr),
        -1 * Math.sin(pi) * Math.sinh(pi)
      )
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}

export class FspDenominator extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const n1 = list.at(0)
    if (n1 instanceof FsRational) {
      return new FsInteger(n1.denominator)
    } else {
      // return n1.value
      return new FsReal(findRationalReps(n1).denominator)
    }
  }
}

export class FspDivide extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      if (canBeTreatedAsComplex(list.at(0))) {
        return list.at(0).multiplicativeInverse()
      }
    } else {
      // for the readability, use this line
      // return new FsNumber(list.at(0).value - FspPlus.proc(list.slice(1)))
      const mutipliedRest = FspMultiply.proc(list.slice(1))
      return list.at(0).multiply(mutipliedRest.multiplicativeInverse())
    }
  }
}

export class FspExactToInexact extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    if (t instanceof FsInteger) {
      return new FsReal(t.value)
    } else if (t instanceof FsReal) {
      return new FsReal(t.value)
    } else if (t instanceof FsRational) {
      return t.asReal()
    } else {
      throw new FsException('sorry, exact complex number is not supported')
    }
  }
}

export class FspExp extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsReal(p)) {
      return new FsReal(Math.exp(p.value))
    } else if (p instanceof FsComplex) {
      // e ^ (a+bi) = e^a * (cos(b) + sin(b)i)
      const e1 = Math.exp(p.real)
      return new FsComplex(
        e1 * Math.cos(p.imaginary),
        e1 * Math.sin(p.imaginary)
      )
    } else {
      throw new FsNotANumberException(p)
    }
  }
}

export class FspExpt extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const p1 = list.at(0)
    const p2 = list.at(1)
    if (p1 instanceof FsInteger && p2 instanceof FsInteger) {
      return new FsInteger(Math.pow(p1.value, p2.value))
    } else if (canBeTreatedAsReal(p1) && canBeTreatedAsReal(p2)) {
      return new FsReal(Math.pow(p1.value, p2.value))
    } else if (canBeTreatedAsComplex(p1) && canBeTreatedAsComplex(p2)) {
      return FspExp.proc(new FsList([p2.multiply(p1.log())]))
    } else {
      throw new FsNotANumberException(p1 + ' or ' + p2)
    }
  }
}

export class FspFloor extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.floor, t)
  }
}
export class FspGcd extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsInteger(0)
    }
    ensureListContainsTwo(list)
    return realParameterBinaryOperation(gcd, list.at(0), list.at(1))
  }
}

export class FspImagPart extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsRational(p)) {
      return new FsInteger(0)
    } else if (p instanceof FsReal) {
      return new FsReal(0.0)
    } else if (p instanceof FsComplex) {
      return new FsReal(p.imaginary)
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}

export class FspInexactToExact extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    if (t instanceof FsInteger) {
      return new FsInteger(t.value)
    } else if (t instanceof FsReal) {
      return new FsReal(t.value, true)
    } else if (t instanceof FsRational) {
      return new FsRational(t.numerator, t.denominator, true)
    } else {
      throw new FsException('sorry, exact complex number is not supported')
    }
  }
}

export class FspLcm extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsInteger(1)
    }
    ensureListContainsTwo(list)
    return realParameterBinaryOperation(lcm, list.at(0), list.at(1))
  }
}

export class FspLog extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    if (canBeTreatedAsReal(list.at(0))) {
      return realParameterUnaryOperation(Math.log, list.at(0))
    } else if (list.at(0) instanceof FsComplex) {
      const pz = list.at(0)
      const pr = pz.real
      const pi = pz.imaginary
      return new FsComplex(Math.log(pz.abs()), Math.atan(pi / pr))
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}

export class FspMagnitude extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsComplex(p)) {
      return p.abs()
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}
export class FspMakePolar extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    if (!canBeTreatedAsReal(list.at(0))) {
      throw new FsException('real number is expected but got ' + list.at(0))
    }
    if (!canBeTreatedAsReal(list.at(1))) {
      throw new FsException('real number is expected but got ' + list.at(1))
    }
    const exp = FspExp.proc(
      new FsList([new FsComplex(0, 1).multiply(list.at(1))])
    )
    return exp.multiply(list.at(0))
  }
}

export class FspMakeRectangular extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    if (!canBeTreatedAsReal(list.at(0))) {
      throw new FsException('real number is expected but got ' + list.at(0))
    }
    if (!canBeTreatedAsReal(list.at(1))) {
      throw new FsException('real number is expected but got ' + list.at(1))
    }
    return new FsComplex(list.at(0).value, list.at(1).value)
  }
}

export class FspMinus extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
        return new FsInteger(list.at(0).value - list.at(1).value) // for performance
      } else {
        return list.at(0).add(list.at(1).additiveInverse())
      }
    } else if (list.length === 1) {
      if (canBeTreatedAsComplex(list.at(0))) {
        return list.at(0).additiveInverse()
      }
    } else {
      // for the readability, use this line
      // return new FsNumber(list.at(0).value - FspPlus.proc(list.slice(1)))
      const sumRest = FspPlus.proc(list.slice(1))
      return list.at(0).add(sumRest.additiveInverse())
    }
  }
}

export class FspMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list.at(0).value
    const divisor = list.at(1).value
    return new FsInteger(dividend % divisor)
  }
}

export class FspModulo extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = ((n1.value % n2.value) + n2.value) % n2.value
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspMultiply extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      return list.at(0).clone()
    } else {
      return list.value.reduce((a, b) => a.multiply(b), new FsInteger(1))
    }
  }
}

export class FspNumberEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    // if (lhs.type !== 'fsnumber' || rhs.type !== 'fsnumber') {
    //   throw new FsException('parameter for "=" must be a number.')
    // }
    if (!(lhs instanceof FsInteger || lhs instanceof FsNumber)) {
      throw new FsException('parameter for "=" must be a number.')
    }
    if (!(rhs instanceof FsInteger || rhs instanceof FsNumber)) {
      throw new FsException('parameter for "=" must be a number.')
    }
    return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FspNumberToString extends FsSExp {
  static proc (list) {
    const radix = list.length === 2 ? list.at(1).value : 10
    const t = list.at(0)
    if (
      !(
        t instanceof FsInteger ||
        t instanceof FsRational ||
        t instanceof FsReal ||
        t instanceof FsComplex
      )
    ) {
      throw new FsException('parameter must be a number but got ' + list.at(0))
    }
    if (radix === 10) {
      return new FsString(list.at(0).toString())
    } else {
      throw new Error('not implemented yet.')
    }
  }
}

export class FspNumerator extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const n1 = list.at(0)
    if (n1 instanceof FsRational) {
      return n1.numerator
    } else {
      return n1.value
    }
  }
}
export class FspPlus extends FsSExp {
  static proc (list) {
    // for the readability, use this line
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))

    // for the performance, use lines below. it may be bit faster.
    //
    if (list.length === 2) {
      if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
        // return list.at(0).add(list.at(1))
        return new FsInteger(list.at(0).value + list.at(1).value) // special case for fibonacci
      } else if (
        canBeTreatedAsReal(list.at(0)) &&
        canBeTreatedAsReal(list.at(1))
      ) {
        return list.at(0).add(list.at(1))
      } else {
        const c1 = FsComplex.fromString(list.at(0).toString())
        const c2 = FsComplex.fromString(list.at(1).toString())
        return c1.add(c2)
      }
    } else if (list.length === 1) {
      return list.at(0).clone()
    } else {
      return list.value.reduce((a, b) => a.add(b), new FsInteger(0))
    }
  }
}

export class FspPow extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
      return new FsInteger(Math.pow(list.at(0).value, list.at(1).value))
    } else {
      return new FsReal(Math.pow(list.at(0).value, list.at(1).value))
    }
  }
}

export class FspRealPart extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (canBeTreatedAsReal(p)) {
      return p.clone()
    } else if (p instanceof FsComplex) {
      return new FsReal(p.real)
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}
export class FspQuotient extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = parseInt(n1.value / n2.value)
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspReminder extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = n1.value - parseInt(n1.value / n2.value) * n2.value
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspRationalize extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const t = list.at(0)
    const epsilon = list.at(1)
    return findRationalReps(t.value, epsilon.value, t.isExact())
  }
}

export class FspRound extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.round, t)
  }
}
export class FspSin extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    if (canBeTreatedAsReal(list.at(0))) {
      return realParameterUnaryOperation(Math.sin, list.at(0))
    } else if (list.at(0) instanceof FsComplex) {
      const pz = list.at(0)
      const pr = pz.real
      const pi = pz.imaginary
      return new FsComplex(
        Math.sin(pr) * Math.cosh(pi),
        Math.cos(pr) * Math.sinh(pi)
      )
    } else {
      throw new FsException('parameter must be a number but got ' + list.at(0))
    }
  }
}

// returns the positive part of Square Root
export class FspSqrt extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const p = list.at(0)
    if (p instanceof FsInteger) {
      const r = Math.sqrt(p.value)
      if (r * r === p.value) {
        return new FsInteger(r)
      } else {
        return new FsReal(r)
      }
    } else if (canBeTreatedAsReal(p)) {
      return new FsReal(Math.sqrt(p.value))
    } else if (p instanceof FsComplex) {
      return p.sqrt()
    } else {
      throw new FsNotANumberException(p)
    }
  }
}

export class FspTan extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    if (canBeTreatedAsReal(list.at(0))) {
      return realParameterUnaryOperation(Math.tan, list.at(0))
    } else if (list.at(0) instanceof FsComplex) {
      const pz = list.at(0)
      const pr = pz.real
      const pi = pz.imaginary
      const div = Math.cos(2 * pr) + Math.cosh(2 * pi)
      return new FsComplex(Math.sin(2.0 * pr) / div, Math.sinh(2.0 * pi) / div)
    } else {
      throw new FsNotANumberException(list.at(0))
    }
  }
}
export class FspTruncate extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.trunc, t)
  }
}

// comparison

export class FspLt extends FsSExp {
  static proc (list) {
    return list.at(0).value < list.at(1).value
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FspLte extends FsSExp {
  static proc (list) {
    return list.at(0).value <= list.at(1).value
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FspGt extends FsSExp {
  static proc (list) {
    return list.at(0).value > list.at(1).value
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FspGte extends FsSExp {
  static proc (list) {
    return list.at(0).value >= list.at(1).value
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

// aggregation

export class FspMax extends FsSExp {
  static proc (list) {
    const target = list.value.map((fsn) => fsn.value)
    if (
      list.length ===
      list.value.filter((l) => {
        return l instanceof FsInteger
      }).length
    ) {
      return new FsInteger(Math.max(...target))
    } else {
      return new FsReal(Math.max(...target))
    }
  }
}

export class FspMin extends FsSExp {
  static proc (list) {
    const target = list.value.map((fsn) => fsn.value)
    if (
      list.length ===
      list.value.filter((l) => {
        return l instanceof FsInteger
      }).length
    ) {
      return new FsInteger(Math.min(...target))
    } else {
      return new FsReal(Math.min(...target))
    }
  }
}
