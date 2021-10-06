'use strict'

import { FsBoolean, FsList, FsNumber, FsPair, FsVector } from './datatypes.js'
import { FsDefinedProcedure } from './sexp.js'
import { FsSExp } from './sexpbase.js'
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
