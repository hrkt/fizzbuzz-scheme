(function (log, FS) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var log__default = /*#__PURE__*/_interopDefaultLegacy(log);
  var FS__default = /*#__PURE__*/_interopDefaultLegacy(FS);

  /** Represents a Scheme "Error" */
  class FsException {
    constructor (message) {
      this.message = message;
      this.name = 'FsException';
    }

    toString () {
      return `${this.name}: "${this.message}"`
    }
  }

  /** Represents a system error */
  class FsError extends Error {
    constructor (message) {
      super(message);
      this.name = 'FsError';
    }

    toString () {
      return `${this.name}: "${this.message}"`
    }
  }

  // Environment
  class FsEnv {
    // static counter = 0

    // use {} instead of new Map() because it is bit faster on benchmarking on fib(30)
    // constructor (outer = null, vars = new Map()) {
    constructor (outer = null, vars = Object.create(null)) {
      this.outer = outer;
      this.vars = vars;
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

    set (k, v) {
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('---------------------------------');
        log__default["default"].debug('env-set k=:' + k + ',v:' + v + ',in:id=' + this.id);
        log__default["default"].debug('---------------------------------');
      }
      this.vars[FsEnv.toKey(k)] = v;
    }

    find (symbol) {
      const key = FsEnv.toKey(symbol);
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('env-find:' + symbol + ' in:' + this + ' key:' + key);
      }

      const v = this.vars[key];
      if (v !== undefined) {
        return v
      } else if (this.outer !== null) {
        // calling outer like below results in exeeding maximum call stack,
        // so we simply use for-loop in this method, and do nut use recursive call.
        //
        // return this.outer.find(symbol)
        let nextOuter = this.outer;
        while (nextOuter !== null) {
          const v = nextOuter.vars[key];
          if (v !== undefined) {
            return v
          }
          nextOuter = nextOuter.outer;
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
  function getGlobalEnv () {
    const env = new FsEnv();
    const prev = log__default["default"].getLevel();
    log__default["default"].setLevel('error');
    // used in eval-each-switches
    env.set(FsSymbol.IF, FsIf);
    env.set(FsSymbol.QUOTE, FsQuote);
    env.set(FsSymbol.DEFINE, FsDefine);
    env.set(FsSymbol.SET_, FsSet);
    env.set(FsSymbol.SET_CDR_, FsProcedureSetCdr);
    env.set(FsSymbol.BEGIN, FsBegin);
    env.set(FsSymbol.LAMBDA, FsLambda);
    env.set(FsSymbol.LET, FsLet);
    // used in eval-last
    env.set(new FsSymbol('+'), FsProcedurePlus.proc);
    env.set(new FsSymbol('-'), FsProcedureMinus.proc);
    env.set(new FsSymbol('*'), FsProcedureMultiply.proc);
    env.set(new FsSymbol('/'), FsProcedureDivide.proc);
    env.set(new FsSymbol('mod'), FsProcedureMod.proc);
    env.set(new FsSymbol('pow'), FsProcedurePow.proc);
    env.set(new FsSymbol('='), FsNumberEquals.proc);
    env.set(new FsSymbol('<'), FsProcedureLt.proc);
    env.set(new FsSymbol('<='), FsProcedureLte.proc);
    env.set(new FsSymbol('>'), FsProcedureGt.proc);
    env.set(new FsSymbol('>='), FsProcedureGte.proc);
    env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc);
    env.set(new FsSymbol('and'), FsAnd.proc);
    env.set(new FsSymbol('append'), FsProcedureAppend.proc);
    env.set(new FsSymbol('abs'), FsProcedureAbs.proc);
    env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc);
    env.set(new FsSymbol('car'), FsCar.proc);
    env.set(new FsSymbol('cdr'), FsCdr.proc);
    env.set(new FsSymbol('cons'), FsCons.proc);
    env.set(new FsSymbol('display'), FsDisplay.proc);
    env.set(new FsSymbol('eq?'), FsPredicateEq.proc);
    env.set(new FsSymbol('equal?'), FsPredicateEqual.proc);
    env.set(new FsSymbol('list'), FsList.proc);
    env.set(new FsSymbol('list?'), FsPredicateList.proc);
    env.set(new FsSymbol('newline'), FsNewline.proc);
    env.set(new FsSymbol('map'), FsProcedureMap.proc);
    env.set(new FsSymbol('max'), FsProcedureMax.proc);
    env.set(new FsSymbol('min'), FsProcedureMin.proc);
    env.set(new FsSymbol('null?'), FsPredicateNull.proc);
    env.set(new FsSymbol('number?'), FsPredicateNumber.proc);
    env.set(new FsSymbol('not'), FsNot.proc);
    env.set(new FsSymbol('pair?'), FsPredicatePair.proc);
    env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc);
    env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc);
    env.set(new FsSymbol('round'), FsProcedureRound.proc);
    env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc);
    env.set(new FsSymbol('vector'), FsProcedureVector.proc);
    env.set(new FsSymbol('vector?'), FsPredicateVector.proc);
    env.set(new FsSymbol('write'), FsWrite.proc);

    log__default["default"].setLevel(prev);
    return env
  }

  // various S-expressions

  class SExpFactory {
    static build (s) {
      if (s === undefined) {
        throw new FsError('passed undefined.') // isNaN(undefined) ==> true
      }
      if (!isNaN(parseFloat(s)) && !isNaN(s - 0)) {
        return new FsNumber(+s)
      } else if (FsBoolean.isFsBooleanString(s)) {
        return FsBoolean.fromString(s)
      } else if (FsChar.isFsChar(s)) {
        return FsChar.fromString(s)
      } else if (s.startsWith('"')) { // equal or faster compared to  s.charAt(0), s.indexOf('"') === 0
        const extracted = s.substring(1, s.length - 1);
        return new FsString(extracted)
      } else {
        return FsSymbol.intern(s) // avoid creating Gabage
      }
    }
  }

  class FsSExp {
    constructor (value = null) {
      if (this.constructor === FsSExp) {
        throw new FsError('FsSexp class can\'t be instantiated.')
      }
    }

    get type () {
      return 'fssexp'
    }

    equals (that) {
      // used in expect .toBe()
      return undefined !== that && (this.value === that.value)
    }

    toString () {
      return this.constructor.name
    }
  }

  class FsAtom extends FsSExp {
    constructor (value = null) {
      super();
      if (this.constructor === FsAtom) {
        throw new FsError('FsAtom class can\'t be instantiated.')
      }
      this.value = value;
    }

    toString () {
      return this.value === null ? 'null' : this.value.toString()
    }
  }

  class FsIf extends FsSExp {
    /**
     * @deprecated since version 0.1.6, this function is inlined to eval-loop
     */
    static proc (list, env) {
      throw new FsError('do not call me.')
      // const [test, conseq, alt] = list
      // if (FsEvaluator.eval(test, env).value) {
      //   return FsEvaluator.eval(conseq, env)
      // } else {
      //   return FsEvaluator.eval(alt, env)
      // }
    }
  }

  class FsLambda extends FsSExp {
    static proc (list, env) {
      const params = list.at(0);

      let body = null;
      if (params instanceof FsSymbol) {
        body = list;
      } else {
        body = list.at(1);
      }
      const procedure = new FsDefinedProcedure(params, body, env);
      return procedure
    }
  }

  class FsDefinedProcedure extends FsSExp {
    constructor (params, body, env) {
      super();
      this.params = params;
      this.body = body;
      this.env = env;

      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('ctor. FsDefinedProcedure with params:' + params + ',body:' + body);
        log__default["default"].debug('--params--');
        log__default["default"].debug(params);
        log__default["default"].debug('--body--');
        log__default["default"].debug(body);
        log__default["default"].debug('------');
      }
    }

    /**
     * @deprecated since version 0.1.6, this function is inlined to eval-loop
     */
    proc (execParams) {
      throw new FsError('do not call me.')
      // const innerEnv = new FsEnv(this.env)
      // if (!Array.isArray(execParams)) {
      //   throw new Error('arg type do not match')
      // }
      // if (this.params instanceof FsSymbol) {
      //   // ex. ((lambda x x) 3 4 5 6)
      //   innerEnv.set(this.params, new FsList(execParams))
      //   return FsEvaluator.eval(this.params, innerEnv)
      // } else {
      //   // ex. (lambda (x) (+ 1 2))
      //   for (let i = 0; i < this.params.length; i++) {
      //     innerEnv.set(this.params[i], execParams[i])
      //   }
      //   return FsEvaluator.eval(this.body, innerEnv)
      // }
    }

    toString () {
      return 'FsDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
    }

    get type () {
      return 'fsdefinedprocedure'
    }
  }

  class FsLet extends FsSExp {
    static proc (list, env) {
      ensureListContainsTwo(list);
      let varDefs = null;
      if (Array.isArray(list) && !(Array.isArray(list.at(0).at(0)))) {
        throw new FsException('syntax error: bindings should have the form ((k 1) ..')
      } else {
        varDefs = list.at(0);
      }

      const innerEnv = new FsEnv(env);
      for (let i = 0; i < varDefs.length; i++) {
        innerEnv.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), env));
      }

      const body = list.at(1);

      return FsEvaluator.eval(body, innerEnv)
    }

    toString () {
      return 'FsDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
    }
  }

  // https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
  class FsDefine extends FsSExp {
    static proc (list, env) {
      ensureListContainsTwo(list);
      const car = list.at(0);
      const cdr = list.at(1);

      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('car:' + car + ',cdr:' + cdr);
        log__default["default"].debug('DUMP-IN-DEFINE car');
        console.dir(car);
        log__default["default"].debug('DUMP-IN-DEFINE cdr');
        console.dir(cdr);
      }

      if (!(car instanceof FsList)) {
        // ex)
        // (define x1 (lambda (x) (* x 2)))
        env.set(car, FsEvaluator.eval(cdr, env));
        return car
      } else {
        // ex)
        // (define (x2 x) (* x 2))
        const funcName = car.at(0);
        const params = car.slice(1);
        const body = cdr;
        const procedure = new FsDefinedProcedure(params, body, env);
        if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
          log__default["default"].debug('define funciton - funcName:' + funcName + ' procedure:' + procedure);
        }
        env.set(funcName, procedure);
        return funcName
      }
    }
  }

  // https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
  class FsSet extends FsSExp {
    static proc (list, env) {
      ensureListContainsTwo(list);
      const symbol = list.at(0);
      const newValue = list.at(1);

      try {
        const prev = env.find(symbol);
        if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
          log__default["default"].debug('set! - pref:' + prev + ' new:' + newValue);
        }
        env.set(symbol, newValue);
        return FsUndefined.UNDEFINED
      } catch (e) {
        throw new FsException('symbol must be defined before calling "set!"')
      }
    }
  }

  class FsBegin extends FsSExp {
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

  class FsQuote extends FsSExp {
    static proc (arg) {
      // arg ... ex) [{"_value":"'"},{"_value":"a"}]
      // '(a (b)) => (a (b))
      const quoteList = arg;
      if (quoteList.at(0) instanceof FsList) {
        const innerList = quoteList.at(0);
        if (FsSymbol.SINGLE_QUOTE.equals(innerList.at(0))) {
          log__default["default"].debug('returning FsList starting with FsSybol.SINGLE_QUOTE');
          return new FsList([innerList.at(0), FsQuote.proc(innerList.slice(1))])
        } else {
          log__default["default"].debug('returning FsList');
          return FsList.proc(innerList)
        }
      } else {
        return new FsList(arg.value)
      }
    }
  }

  class FsBoolean extends FsAtom {
    static TRUE_ = Object.freeze(new FsBoolean(true))
    static FALSE_ = Object.freeze(new FsBoolean(false))

    static get TRUE () { return FsBoolean.TRUE_ }
    static get FALSE () { return FsBoolean.FALSE_ }
    // using these direct call do not increase performance, so we use getter
    // static TRUE = FsBoolean.TRUE_
    // static FALSE = FsBoolean.FALSE_

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

  class FsNumber extends FsAtom {
    toString () {
      return this.value
    }

    equals (target) {
      return this.value === target.value
    }

    get type () {
      return 'fsnumber'
    }
  }

  class FsChar extends FsAtom {
    static isFsChar (s) {
      return (s.charAt(0) === '#' && s.charAt(1) === '\\' && s.length === 3)
    }

    static fromString (s) {
      // s is "#\a" and previously checked its format.
      return new FsChar(s.charAt(2))
    }

    toString () {
      return this.value
    }

    equals (target) {
      return this.value === target.value
    }
  }

  class FsString extends FsAtom {
    toString () {
      return '"' + this.value + '"'
    }
  }

  class FsSymbol extends FsAtom {
    static IF = Object.freeze(new FsSymbol('if'))
    static QUOTE = Object.freeze(new FsSymbol('quote'))
    static SINGLE_QUOTE = Object.freeze(new FsSymbol('\''))
    static DEFINE = Object.freeze(new FsSymbol('define'))
    static SET_ = Object.freeze(new FsSymbol('set!'))
    static SET_CDR_ = Object.freeze(new FsSymbol('set-cdr!'))
    static BEGIN = Object.freeze(new FsSymbol('begin'))
    static LAMBDA = Object.freeze(new FsSymbol('lambda'))
    static LET = Object.freeze(new FsSymbol('let'))
    static DOT = Object.freeze(new FsSymbol('.'))
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
        case 'set-cdr!':
          return this.SET_CDR_
        case 'begin':
          return this.BEGIN
        case 'lambda':
          return this.LAMBDA
        case 'let':
          return this.LET
        case '.':
          return this.DOT
        default:
          return Object.freeze(new FsSymbol(str))
      }
    }

    get type () {
      return 'fssymbol'
    }
  }

  class FsUndefined extends FsAtom {
    static UNDEFINED_ = new FsUndefined()

    static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

    toString () {
      return '#undefined'
    }
  }

  function ensureListContains (list, length) {
    if (!(list instanceof FsList) || list.length !== length) {
      throw new FsException('this procedure must take ' + length + ' argument(s) as list')
    }
  }

  function ensureListContainsTwo (list) {
    ensureListContains(list, 2);
  }

  function ensureListContainsOne (list) {
    ensureListContains(list, 1);
  }

  class FsProcedureAbs extends FsSExp {
    static proc (list) {
      if (!(list.at(0) instanceof FsNumber)) {
        throw new FsException('arg must be number')
      }
      return new FsNumber(Math.abs(list.at(0).value))
    }
  }

  class FsProcedurePlus extends FsSExp {
    static proc (list) {
      // for the readability, use this line
      // return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))

      // for the performance, use lines below. it may be bit faster.
      //
      if (list.length === 2) {
        return new FsNumber(list.at(0).value + list.at(1).value)
      } else if (list.length === 1) {
        return new FsNumber(list.at(0).value)
      } else {
        let buf = 0;
        for (let i = 0; i < list.length; i++) {
          buf += list.at(i).value;
        }
        return new FsNumber(buf)
      }
    }
  }

  class FsProcedureRound extends FsSExp {
    static proc (list) {
      return new FsNumber(Math.round(list.at(0).value))
    }
  }

  class FsProcedureMultiply extends FsSExp {
    static proc (list) {
      if (list.length === 0) {
        return new FsNumber(1)
      }
      // return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
      let buf = list.at(0).value;
      for (let i = 1; i < list.length; i++) {
        buf *= list.at(i).value;
      }
      return new FsNumber(buf)
    }
  }

  class FsProcedureMinus extends FsSExp {
    static proc (list) {
      if (list.length === 2) {
        return new FsNumber(list.at(0).value - list.at(1).value)
      } else if (list.length === 1) {
        return new FsNumber(-1 * (list.at(0).value))
      } else {
        // for the readability, use this line
        // return new FsNumber(list.at(0).value - FsProcedurePlus.proc(list.slice(1)))

        // for the performance, use lines below. it may be bit faster.
        //
        let buf = list.at(0).value;
        for (let i = 1; i < list.length; i++) {
          buf -= list.at(i);
        }
        return new FsNumber(buf)
      }
    }
  }

  class FsProcedureDivide extends FsSExp {
    static proc (list) {
      if (list.length === 1) {
        // TODO: support rational number
        if (list.at(0).value !== 0) {
          return new FsNumber(list.at(0).value)
        } else {
          throw new FsException('divide by 0')
        }
      } else {
        const divisor = FsProcedureMultiply.proc(list.slice(1));
        if (divisor.value !== 0) {
          return new FsNumber(list.at(0).value / divisor.value)
        } else {
          throw new FsException('divide by 0')
        }
      }
    }
  }

  class FsProcedureMod extends FsSExp {
    static proc (list) {
      ensureListContainsTwo(list);
      const dividend = list.at(0).value;
      const divisor = list.at(1).value;
      return new FsNumber(dividend % divisor)
    }
  }

  class FsProcedurePow extends FsSExp {
    static proc (list) {
      ensureListContainsTwo(list);
      return new FsNumber(Math.pow(list.at(0).value, list.at(1).value))
    }
  }

  class FsPredicateEq extends FsSExp {
    static proc (list) {
      ensureListContainsTwo(list);
      const lhs = list.at(0);
      const rhs = list.at(1);
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

  class FsPredicateEqual extends FsSExp {
    static proc (list) {
      ensureListContainsTwo(list);
      const lhs = list.at(0);
      const rhs = list.at(1);

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

  class FsNumberEquals extends FsSExp {
    static proc (list) {
      ensureListContainsTwo(list);
      const lhs = list.at(0);
      const rhs = list.at(1);
      if (lhs.type !== 'fsnumber' || rhs.type !== 'fsnumber') {
        throw new FsException('parameter for "=" must be a number.')
      }
      return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsProcedureLt extends FsSExp {
    static proc (list) {
      return list.at(0).value < list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsProcedureLte extends FsSExp {
    static proc (list) {
      return list.at(0).value <= list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsProcedureGt extends FsSExp {
    static proc (list) {
      return list.at(0).value > list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsProcedureGte extends FsSExp {
    static proc (list) {
      return list.at(0).value >= list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsAnd extends FsSExp {
    static proc (list) {
      if (list.length === 2) {
        const lhs = list.at(0);
        const rhs = list.at(1);
        return lhs === FsBoolean.TRUE && rhs === FsBoolean.TRUE ? FsBoolean.TRUE : FsBoolean.FALSE
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

  class FsNot extends FsSExp {
    static proc (list) {
      ensureListContainsOne(list);
      const target = list.at(0);
      if (target instanceof FsBoolean) {
        return target.value ? FsBoolean.FALSE : FsBoolean.TRUE
      } else {
        return FsBoolean.FALSE
      }
    }
  }

  class FsProcedureVector extends FsSExp {
    static proc (list) {
      return new FsVector(list.value)
    }
  }

  class FsProcedureMap extends FsSExp {
    static proc (list, env) {
      const p = list.at(0);
      const body = list.at(1);
      const ret = [];
      for (let i = 0; i < body.length; i++) {
        ret.push(FsEvaluator.eval(new FsList([p, body.at(i)]), env));
      }
      return new FsList(ret)
    }
  }

  class FsProcedureMax extends FsSExp {
    static proc (list) {
      const target = list.value.map(fsn => fsn.value);
      return new FsNumber(Math.max(...target))
    }
  }

  class FsProcedureMin extends FsSExp {
    static proc (list) {
      const target = list.value.map(fsn => fsn.value);
      return new FsNumber(Math.min(...target))
    }
  }

  class FsProcedureAppend extends FsSExp {
    static proc (list) {
      const newList = [];
      for (let j = 0; j < list.length; j++) {
        for (let i = 0; i < list.at(j).length; i++) {
          newList.push(list.at(j).at(i));
        }
      }
      return new FsList(newList)
    }
  }

  class FsProcedureSetCdr extends FsSExp {
    static proc (list, env) {
      const evaledCurrent = FsEvaluator.eval(list.at(0), env);
      if (evaledCurrent instanceof FsPair) {
        const np = new FsPair(evaledCurrent.car, list.at(1));
        env.set(list.at(0), np);
      } else if (evaledCurrent instanceof FsList) {
        const np = new FsPair(evaledCurrent.at(0), list.at(1));
        env.set(list.at(0), np);
      }
      // const target = list.at(0)
      // const newCdr = list.at(1)
      // target.value.at(0), newCdr
      return FsUndefined.UNDEFINED
    }
  }

  class FsWrite extends FsSExp {
    static proc (list) {
      process.stdout.write(list.value.map(s => s.value).join(' '));
      return FsUndefined.UNDEFINED
    }
  }

  class FsNewline extends FsSExp {
    static proc (list) {
      console.log();
      return FsUndefined.UNDEFINED
    }
  }

  // returns memory usage of called time.
  //
  // only works with Node
  class FsPeekMemoryUsage extends FsSExp {
    static proc (list) {
      const m = process.memoryUsage();
      return new FsString(JSON.stringify(m))
    }
  }

  // print s-exp in list. For FsString, print its value without double quotes.
  class FsDisplay extends FsSExp {
    static proc (list) {
      process.stdout.write(list.value.map(s => (s instanceof FsString ? s.value : s.toString())).join(' '));
      return FsUndefined.UNDEFINED
    }
  }

  class FsList extends FsSExp {
    static EMPTY = Object.freeze(new FsList([]))
    constructor (value = []) {
      super();
      this.value = value;
    }

    get type () {
      return 'fslist'
    }

    push (s) {
      this.value.push(s);
    }

    slice (index) {
      return new FsList(this.value.slice(index))
    }

    get length () {
      return this.value.length
    }

    at (index) {
      return this.value[index]
    }

    set (index, v) {
      this.value[index] = v;
    }

    static proc (arg) {
      return arg.length === 0 ? FsList.EMPTY : new FsList(arg.value)
    }

    static isEmptyList (arg) {
      return (arg instanceof FsList) && arg.length === 0
    }

    toString () {
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('FsList.toString() called. this.value:' + JSON.stringify(this.value, null, 2));
      }
      if (FsSymbol.SINGLE_QUOTE.equals(this.value[0])) {
        log__default["default"].debug('PRINTING AS SINGLE_QUOTE');
        return '\'' + this.value[1].toString()
      } else {
        // TODO: this is not optimal, but pass sample code in R5RS
        log__default["default"].debug('PRINTING AS LIST');
        // return '(' + this.value.map(v => v.toString()).join(' ') + ')'
        let buf = '';
        buf += '(';
        for (let i = 0; i < this.value.length; i++) {
          if (!Array.isArray(this.value[i])) {
            buf += this.value[i].toString();
            log__default["default"].debug(buf);
            buf += ' ';
          } else {
            buf += '(';
            for (let j = 0; j < this.value[i].length; j++) {
              buf += this.value[i][j];
              buf += ' ';
            }
            if (this.value[i].length > 0) {
              buf = buf.substr(0, buf.length - 1);
            }
            buf += ')';
            buf += ' ';
          }
        }
        if (this.value.length > 0) {
          buf = buf.substr(0, buf.length - 1);
        }
        buf += ')';
        return buf
      }
    }
  }

  class FsVector extends FsSExp {
    /**
     *
     * @param {*} arg Array
     */
    constructor (arg) {
      super();
      this.value = arg;
    }

    toString () {
      return '#(' + this.value.map(s => s.toString()).join(' ') + ')'
    }
  }

  class FsPair extends FsList {
    constructor (car, cdr) {
      super();
      this.car = car;
      this.cdr = cdr;
    }

    toString () {
      return '(' + this.car + ' . ' + this.cdr + ')'
    }
  }

  class FsCar extends FsSExp {
    static proc (arg) {
      const target = arg.at(0);
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

  class FsCdr extends FsSExp {
    static proc (arg) {
      const target = arg.at(0);
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

  class FsCons extends FsSExp {
    static proc (arg) {
      ensureListContainsTwo(arg);
      // TODO dot pair
      if (arg.at(1) instanceof FsList) {
        return new FsList([arg.at(0)].concat(arg.at(1).value))
      } else {
        return new FsPair(arg.at(0), arg.at(1))
      }
    }
  }

  class FsPredicateNull extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsList && (list.at(0)).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsPredicateBoolean extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsBoolean ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsPredicateList extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsList ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsPredicateNumber extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsNumber ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsPredicateSymbol extends FsSExp {
    static proc (list, env) {
      return (list.at(0) instanceof FsSymbol)
        ? FsBoolean.TRUE
        : FsBoolean.FALSE
    }
  }

  class FsPredicateProcedure extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsDefinedProcedure ? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }

  class FsPredicatePair extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsPair ||
      (list.at(0) instanceof FsList && !FsList.isEmptyList(list.at(0)))
        ? FsBoolean.TRUE
        : FsBoolean.FALSE
    }
  }

  class FsPredicateVector extends FsSExp {
    static proc (list) {
      return list.at(0) instanceof FsVector
        ? FsBoolean.TRUE
        : FsBoolean.FALSE
    }
  }

  // Evaluator
  class FsEvaluator {
    static evalCounter = 0
    static evalOuter (sexp, env = getGlobalEnv()) {
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('----------------------------------------------------');
        log__default["default"].debug('EVAL:' + sexp + ' in ' + env.toString());
        log__default["default"].debug(JSON.stringify(sexp));
      }
      const ret = FsEvaluator.eval(sexp, env);
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('RETURNS:' + ret.toString() + ' for sexp:' + sexp);
        log__default["default"].debug('----------------------------------------------------');
      }
      return ret
    }

    // static eval (sexp, env = getGlobalEnv()) {
    static eval (sexp, env = getGlobalEnv()) {
      while (true) {
        // FsEvaluator.evalCounter++
        // do not use sexp.instanceof XXXX because it's slower than simple field comparison
        if (sexp.type === 'fssymbol') {
          return env.find(sexp)
        } else if (sexp.type !== 'fslist') {
        // i.e. FsNumber, FsBoolean...
          return sexp
        // } else if (sexp === FsList.EMPTY) {
          // after this case, "sexp" is a instance of FsList
        } else if (sexp.length === 0) {
          return FsList.EMPTY
        } else { // list-case
          const firstSymbol = sexp.at(0);
          if (FsSymbol.IF === firstSymbol) {
            FsEvaluator.eval(sexp.at(1), env).value ? sexp = sexp.at(2) : sexp = sexp.at(3);
          } else if (FsSymbol.QUOTE === firstSymbol || FsSymbol.SINGLE_QUOTE === firstSymbol) {
            return sexp.at(1)
          } else if (FsSymbol.DEFINE === firstSymbol) {
            return FsDefine.proc(sexp.slice(1), env)
          } else if (FsSymbol.SET_ === firstSymbol) {
            return FsSet.proc(sexp.slice(1), env)
          } else if (FsSymbol.SET_CDR_ === firstSymbol) {
            return FsProcedureSetCdr.proc(sexp.slice(1), env)
          } else if (FsSymbol.BEGIN === firstSymbol) {
            let ret = null;
            for (let i = 1; i < sexp.length; i++) {
              ret = FsEvaluator.eval(sexp.at(i), env);
            }
            sexp = ret;
          } else if (FsSymbol.LAMBDA === firstSymbol) {
            return FsLambda.proc(sexp.slice(1), env)
          } else if (FsSymbol.LET === firstSymbol) {
            return FsLet.proc(sexp.slice(1), env)
          } else {
          // for the readability, use this line
          // const args = sexp.slice(1).map(s => this.eval(s, env))

            // for the performance, use lines below. it may be bit faster.
            // const evaled = []
            // for (let i = 0; i < sexp.length; i++) {
            //   evaled.push(FsEvaluator.eval(sexp[i], env))
            // }

            const p = FsEvaluator.eval(firstSymbol, env);
            if (p.type === 'fsdefinedprocedure') {
              const innerEnv = new FsEnv(p.env);
              if (p.params.type === 'fssymbol') {
                // ex. ((lambda x x) 3 4 5 6)
                const evaled = [];
                for (let i = 1; i < sexp.length; i++) {
                  evaled.push(FsEvaluator.eval(sexp.at(i), env));
                }
                innerEnv.set(p.params, new FsList(evaled));
                sexp = p.params;
                env = innerEnv;
              } else {
                // ex. (lambda (x) (+ 1 2))
                for (let i = 0; i < p.params.length; i++) {
                  innerEnv.set(p.params.at(i), FsEvaluator.eval(sexp.at(i + 1), env));
                }
                sexp = p.body;
                env = innerEnv;
              }
            } else {
            // evaled.length = sexp.length - 1 // this line slows execution, so we do not do this.
              const evaled = new FsList();
              for (let i = 1; i < sexp.length; i++) {
                evaled.set(i - 1, FsEvaluator.eval(sexp.at(i), env));
              }
              return p(evaled, env) // for testing map
            }
          } // user-defined-proc or pre-defined proc
        } // list-case
      }
    }
  }

  // Parser
  class FsParser {
    static tokenize (code) {
      const tokenList = [];
      let buf = '';
      let i = 0;
      log__default["default"].debug('tokenizing: length=' + code.length);
      log__default["default"].debug(code);

      // eslint-disable-next-line no-labels
      nextLoop:
      while (i < code.length) {
        let c = code.charAt(i);
        log__default["default"].debug('i: ' + i + '\tc:' + c);
        // found comment char, then read to the end of line ignoring comments.
        if (c === ';') {
          while (i < code.length && c !== '\n') {
            i++;
            c = code.charAt(i);
          }
          continue
        }

        // found brackets or quote chars, then use it as token and continue.
        if (c === '(' || c === ')' || c === '\'') {
          tokenList.push(c);
          i++;
          continue
        }

        // vector or boolean letheral
        if (c === '#') {
          if (i + 1 >= code.length) {
            throw new FsException('Syntax Error: at ' + (i + 1))
          }
          // boolean
          if (code.charAt(i + 1) === 't' || code.charAt(i + 1) === 'f') {
            buf += '#' + code.charAt(i + 1);
            i++; // "#"
            i++; // "t" or "f"
            tokenList.push(buf);
            buf = '';
            continue
          }
          // char
          if (code.charAt(i + 1) === '\\') {
            if (i + 2 >= code.length) {
              throw new FsException('Syntax Error: at ' + (i + 2))
            }
            buf += '#' + code.charAt(i + 1) + code.charAt(i + 2);
            i++; // "#"
            i++; // "\"
            i++; // character
            tokenList.push(buf);
            buf = '';
            continue
          }
          // vector
          if (code.charAt(i + 1) === '(') {
            tokenList.push(c);
            i++;
            continue
          }
          throw new FsException('Syntax Error: at ' + i)
        }

        // found double quote, then read eager.
        if (c === '"') {
          buf += c;
          i++;

          while (i < code.length) {
            log__default["default"].debug('\ti: ' + i + '\tc:' + code.charAt(i));
            if (code.charAt(i) === '\\' && code.charAt(i + 1) === '"') {
              buf += '\\"';
              i += 2;
            } else if (code.charAt(i) === '"') {
              buf += '"';
              tokenList.push(buf);
              buf = '';
              i++;
              log__default["default"].debug('continue to nextLoop:, i=' + i);
              // eslint-disable-next-line no-labels
              continue nextLoop
            } else {
              buf += code.charAt(i);
              i++;
            }
          }
        }

        if (c === ' ' || FsParser.isControlChar(c)) {
          i++;
          continue
        }

        while (i < code.length && c !== ' ' && !FsParser.isControlChar(c) && c !== ')') {
          buf += c;
          i++;
          c = code.charAt(i);
        }

        tokenList.push(buf);

        buf = '';
      }
      return tokenList
    }

    static isControlChar (c) {
      return c === '\t' || c === '\n' || c === '\r'
    }

    static element (token) {
      return SExpFactory.build(token)
    }

    static readTokens (tokenized, inQuoted = false) {
      const t = tokenized.shift();
      // quoted
      if (t === '\'') {
        const l = new FsList();
        // l.push(FsParser.element('\''))
        l.push(FsSymbol.SINGLE_QUOTE);
        l.push(FsParser.readTokens(tokenized, true));
        log__default["default"].debug('created array : ' + l.length);
        return l
      }
      // vector
      if (t === '#') {
        return new FsVector(FsParser.readTokens(tokenized, inQuoted).value)
      }
      // list
      if (t === '(') {
        const l = new FsList();
        while (tokenized[0] !== ')' && tokenized.length > 0) {
          l.push(FsParser.readTokens(tokenized, inQuoted));
        }
        tokenized.shift();
        return l
      } else if (t === ')') {
        throw new FsException('syntax error: too much ")"')
      } else {
        return FsParser.element(t)
      }
    }

    static readTokensOuter (tokenized) {
      log__default["default"].debug('length: ' + tokenized.length);

      const orders = [];
      while (tokenized.length > 0) {
        const ret = this.readTokens(tokenized);
        orders.push(ret);
      }
      return orders
    }

    static parse (code) {
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('------');
        log__default["default"].debug('parse: >>> ' + code + ' <<<');
      }
      const tokenized = this.tokenize(code);
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('------');
        log__default["default"].debug('tokenized: >>> ' + tokenized + ' <<<');
      }
      const orders = FsParser.readTokensOuter(tokenized);
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('------');
        log__default["default"].debug(orders.length);
        log__default["default"].debug('parsed: >>> ' + orders + '<<<');
        log__default["default"].debug('------');
        log__default["default"].debug(JSON.stringify(orders, null, 2));
        log__default["default"].debug('------');
      }
      return orders
    }
  }

  class FsAdjuster {
    // pre process sexp
    static adjust (sexpList) {
      if (sexpList === undefined) {
        throw new FsError('ERROR: "undefined" was passed to adjest() ')
      }
      if (!Array.isArray(sexpList)) {
        throw new FsError('ERROR: should pass array to adjest() ')
      }

      const ret = sexpList.map(sexp => FsAdjuster.adjustInner(sexp));
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('------');
        log__default["default"].debug(ret.length);
        for (let i = 0; i < ret.length; i++) {
          log__default["default"].debug('adjusted : ' + i + ' : >>> ' + ret[i] + ' <<<');
        }
        log__default["default"].debug('------');
        log__default["default"].debug(JSON.stringify(ret, null, 2));
        log__default["default"].debug('------');
      }
      return ret
    }

    static adjustInner (sexp) {
      if (sexp === undefined) {
        throw new FsError('ERROR: "undefined" was passed to adjustInner() ')
      }
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug(JSON.stringify(sexp, null, 2));
      }
      if (!(sexp instanceof FsList)) {
        // it passes "null".
        // ex. after adjusting (if #f 1) => (if #f 1 null)
        return sexp
      // } if (Array.isArray(sexp) && sexp.length === 0) {
      //   return FsList.EMPTY
      } else if (sexp.at(0) === FsSymbol.IF) {
        if (sexp.length <= 2) {
          throw new FsException('Syntax Error: malformed if:' + sexp)
        }
        if (sexp.length === 3) {
          // ex. [if #t 1] => [if #t 1 null]
          sexp.push(FsUndefined.UNDEFINED);
        }
        // return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
        return new FsList(sexp.value.map(sexp => FsAdjuster.adjustInner(sexp)))
      } else if (sexp.at(0) instanceof FsSymbol && (
        sexp.at(0).value === '<' ||
        sexp.at(0).value === '<=' ||
        sexp.at(0).value === '>' ||
        sexp.at(0).value === '>='
      )) {
        if (sexp.length <= 2) {
          throw new FsException('Syntax Error: malformed :' + sexp)
        }
        // return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
        return new FsList(sexp.value.map(sexp => FsAdjuster.adjustInner(sexp)))
      } else if (sexp.at(0) instanceof FsSymbol && sexp.at(0).value === 'set!') {
        if (sexp.length !== 3) {
          throw new FsException('Syntax Error: malformed :' + sexp)
        }
        return sexp
      } else if (isDotPair(sexp)) {
        return toDotPair(sexp)
        // return sexp
      } else {
        return sexp
      }
    }
  }

  /**
   *
   * @param {*} sexp as FSList
   * @returns true if sexp is a valid pair expression.
   */
  function isDotPair (sexp) {
    if (!(sexp instanceof FsList)) {
      return false
    }
    if (sexp.at(0) !== FsSymbol.QUOTE && sexp.at(0) !== FsSymbol.SINGLE_QUOTE) {
      return false
    }

    const argList = sexp.at(0) === FsSymbol.SINGLE_QUOTE ? sexp.at(1).value : sexp.slice(1);
    if (!(Array.isArray(argList)) || argList.length <= 2) {
      return false
    }
    const dots = argList.filter(s => s === FsSymbol.DOT).length;

    if (dots === 0) {
      return false
    } else if (dots >= 2) {
      throw new FsException('Sysntax Error: too many "."s ')
    } else {
      // dots === 1
      console.dir(argList[argList.length - 2]);
      if (argList.length >= 3 && argList[argList.length - 2] === Symbol.DOT) {
        return true
      } else {
        throw new FsException('Sysntax Error: bad "." ')
      }
    }
  }

  function toDotPair (sexp) {
    // sexp should be valid pair style. ie. (x x . x)

    const buf = [];
    buf.concat(sexp.value.slice(0, sexp.length - 3));
    buf.concat(sexp.at(sexp.lengh - 1));

    let p = new FsPair(buf.at(buf.length - 2), buf.at(buf.length - 1));
    for (let i = buf.length - 3; i >= 0; i--) {
      const sp = new FsPair(buf.at(i), p);
      p = sp;
    }

    return p
  }

  // Environment
  class FizzBuzzScheme {
    constructor () {
      this.env = getGlobalEnv();
      this.debugMode = false;
      if (log__default["default"].getLevel() <= log__default["default"].levels.DEBUG) {
        log__default["default"].debug('=======================================================================-');
      }
    }

    eval (code) {
      const orders = FsParser.parse(code);
      const adjusted = FsAdjuster.adjust(orders);
      log__default["default"].debug('🤖');
      log__default["default"].debug('orders.length = ' + orders.length);
      log__default["default"].debug('adjusted.length = ' + adjusted.length);
      let ret = null;
      for (let i = 0; i < adjusted.length; i++) {
        if (!this.debugMode) {
          ret = FsEvaluator.eval(adjusted[i], this.env);
        } else {
          ret = FsEvaluator.evalOuter(adjusted[i], this.env);
        }
      }
      return ret
    }

    evalToJs (code) {
      return this.eval(code, this.env).toString()
    }

    enableDebugMode () {
      log__default["default"].setLevel('trace');
    }
  }

  log__default["default"].setLevel('info');

  class FsCli {
    static main (argv) {
      // argv[0] -> path of node.exe
      // argv[1] -> path of this script
      log__default["default"].debug('args: ' + argv);
      if (argv.length <= 2) {
        console.log('usage: node fbs.js {file}');
        process.exit(0);
      }
      const engine = new FizzBuzzScheme();
      for (let i = 2; i < argv.length; i++) {
        log__default["default"].debug('executing:' + argv[i]);
        const file = argv[i];
        const data = FS__default["default"].readFileSync(file, 'utf8');
        engine.eval(data);
        log__default["default"].debug('eval count' + FsEvaluator.evalCounter);
      }
      process.exit(0);
    }
  }

  log__default["default"].setLevel('info');

  FsCli.main(process.argv);

})(log, FS);
