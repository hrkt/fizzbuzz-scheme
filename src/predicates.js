'use strict'

import { FsBoolean, FsChar, FsList, FsNumber, FsPair, FsVector } from './datatypes.js'
import { FsDefinedProcedure } from './sexp.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsTwo } from './sexputils.js'
import { FsSymbol } from './symbol.js'

export class FsPredicateNull extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsList && (list.at(0)).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateBoolean extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsBoolean ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateList extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsList ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateNumber extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsNumber ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateSymbol extends FsSExp {
  static proc (list, env) {
    return (list.at(0) instanceof FsSymbol)
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateProcedure extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsDefinedProcedure ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicatePair extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsPair ||
      (list.at(0) instanceof FsList && !FsList.isEmptyList(list.at(0)))
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateVector extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsVector
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateEq extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    if (lhs instanceof FsNumber && rhs instanceof FsNumber) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsChar && rhs instanceof FsChar) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsSymbol && rhs instanceof FsSymbol) {
      // ex. (eq? 'a 'a)
      return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsList && rhs instanceof FsList) {
      if (lhs.length === 0 && rhs.length === 0) {
        return FsBoolean.TRUE
      } else if ((lhs.length === 1 && rhs.length === 1) &&
      (lhs.at(0) === rhs.at(0))) {
        // ex. (let ((x \'(a))) (eq? x x)); 2 objects point the same object on the memory
        // ; It is not the comparison between their values
        return FsBoolean.TRUE
      } else {
        return FsBoolean.FALSE
      }
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs === rhs ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}

export class FsPredicateEqv extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)

    if ((lhs === FsBoolean.TRUE && rhs === FsBoolean.TRUE) ||
      (lhs === FsBoolean.FALSE && rhs === FsBoolean.FALSE)) {
      return FsBoolean.TRUE
    } else if (lhs instanceof FsSymbol && rhs instanceof FsSymbol &&
      lhs.value === rhs.value) {
      return FsBoolean.TRUE
    } else {
      return FsBoolean.FALSE
    }
  }
}

export class FsPredicateEqual extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)

    if (lhs instanceof FsList && rhs instanceof FsList) {
      // TODO: this might not be fast, but works.
      return JSON.stringify(lhs) === JSON.stringify(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs.toString() === rhs.toString() ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}
