'use strict'

import { canBeTreatedAsComplex, FsBoolean, FsChar, FsInteger, FsList, FsNumber, FsPair, FsString, FsVector } from './datatypes.js'
import { FssDefinedProcedure } from './sexp.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsOne, ensureListContainsOnlyTypeOf, ensureListContainsTwo, ensureListLengthAtLeast, isTrueForAllPaisInOrder } from './sexputils.js'
import { FsSymbol } from './symbol.js'

export class FsPredicateBoolean extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsBoolean ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateChar extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    return list.at(0) instanceof FsChar ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateCharEquals extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    ensureListContainsOnlyTypeOf(list, FsChar)
    return list.value.filter(t => list.at(0).equals(t)).length === list.length ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateCharGreaterThan extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    ensureListContainsOnlyTypeOf(list, FsChar)
    return isTrueForAllPaisInOrder(list, 'gt') ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateCharGreaterThanOrEqualsTo extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    ensureListContainsOnlyTypeOf(list, FsChar)
    return isTrueForAllPaisInOrder(list, 'gte') ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateCharLessThan extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    ensureListContainsOnlyTypeOf(list, FsChar)
    return isTrueForAllPaisInOrder(list, 'lt') ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateCharLessThanOrEqualsTo extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    ensureListContainsOnlyTypeOf(list, FsChar)
    return isTrueForAllPaisInOrder(list, 'lte') ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateList extends FsSExp {
  static proc (list) {
    return !(list.at(0) instanceof FsPair) && list.at(0) instanceof FsList ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateNumber extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsNumber || list.at(0) instanceof FsInteger ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateNull extends FsSExp {
  static proc (list) {
    // currently fspair is subclass of fslist, so this line does not work correctly.
    //
    // return list.at(0) instanceof FsList && list.at(0).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
    //
    // we use 'type' original property here, same as in eval-loop
    return list.at(0).type === 'fslist' && list.at(0).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateStringEquals extends FsSExp {
  static proc (list, env) {
    ensureListLengthAtLeast(list, 2)
    if (!(list.at(0) instanceof FsString)) {
      return false
    }
    return list.value.filter(t => list.at(0).equals(t)).length === list.length ? FsBoolean.TRUE : FsBoolean.FALSE
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
    return list.at(0) instanceof FssDefinedProcedure ||
    typeof list.at(0) === 'function'
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
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

export class FsPredicateString extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsString
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
    if (lhs instanceof FsInteger && rhs instanceof FsInteger) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsNumber && rhs instanceof FsNumber) {
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

// see "6.1  Equivalence predicates"
export class FsPredicateEqv extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)

    if (lhs instanceof FsBoolean && lhs.equals(rhs)) {
      return FsBoolean.TRUE
    } else if (lhs instanceof FsSymbol && rhs instanceof FsSymbol &&
      lhs.value === rhs.value) {
      return FsBoolean.TRUE
    } else if (canBeTreatedAsComplex(lhs) && canBeTreatedAsComplex(rhs) &&
      lhs.equals(rhs)) {
      return FsBoolean.TRUE
    } else if (lhs instanceof FsPair && rhs instanceof FsPair) {
      return lhs === rhs ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsVector && rhs instanceof FsVector) {
      return lhs === rhs ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsString && rhs instanceof FsString) {
      return lhs === rhs ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsList && rhs instanceof FsList && lhs.length === 0 && rhs.length === 0) {
      // changed order
      // currentry FsPair is a subclass of FsList, so prevent calling lists-case for pairs,
      // changed their mutual order
      return FsBoolean.TRUE
    } else if (lhs instanceof FssDefinedProcedure && rhs instanceof FssDefinedProcedure) {
      return lhs.id === rhs.id ? FsBoolean.TRUE : FsBoolean.FALSE
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
