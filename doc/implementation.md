# Evaluator Design and Continuation Implementation

## 1. Project Overview

FizzBuzz Scheme is a small Scheme interpreter implemented in JavaScript. Scheme source is parsed into S-expression objects and evaluated against a chain of `FsEnv` environments.

The main runtime pieces are:

- `src/parser.js`: converts Scheme source into S-expression objects.
- `src/sexp.js`: defines S-expression types, special-form helpers, and primitive procedures.
- `src/env.js`: implements lexical environments and mutable bindings.
- `src/evaluator.js`: evaluates expressions and applies procedures.
- `src/global-env.js`: installs the standard procedures available to Scheme programs.

The public entry point is `FizzBuzzScheme` in `src/index.js`. Existing callers can evaluate Scheme source without knowing about the internal evaluator state.

## 2. Environments and Closures

`FsEnv` represents one lexical environment. Each environment contains local bindings and an optional reference to its outer environment.

A lambda creates an `FssDefinedProcedure` containing:

- its formal parameters,
- its body expressions,
- the environment in which it was created.

When the procedure is called, the evaluator creates a child `FsEnv` whose outer environment is the procedure's captured environment. This gives the interpreter lexical scoping and allows closures to retain variables after the surrounding expression has finished.

Bindings are mutable because Scheme's `set!` updates an existing binding. The environment chain is therefore shared by closures instead of being copied when a procedure is created.

## 3. Evaluation Model Before the Continuation Work

`FsEvaluator.eval` uses a `while` loop for the main tail-position path. For a user-defined procedure, it binds the arguments and replaces the current expression and environment with the procedure body. This avoids growing the JavaScript stack for ordinary tail calls.

The evaluator handles several special forms directly:

- `if`
- `quote` and quasiquote forms
- `define`
- `begin`
- `lambda`
- `let`, `let*`, and `letrec*`
- `cond`
- `or`
- `delay`
- `call/cc`
- `call-with-values`
- `dynamic-wind`

Other lists are treated as procedure applications. The operator is evaluated first, then the arguments are evaluated, and finally the resulting procedure is called.

## 4. Procedure Bodies Are Sequences

A Scheme procedure can contain more than one body expression. All expressions must run from left to right, and the value of the last expression is the procedure result.

The evaluator represents a multi-expression body as an implicit `begin`:

```javascript
const body = p.body.length === 1
  ? p.body.at(0)
  : new FsList([FsSymbol.BEGIN, ...p.body.value])
```

This is important for code such as:

```scheme
(lambda ()
  (set! state 'ready)
  state)
```

Without this conversion, only the first expression would run and the procedure would return the wrong value.

## 5. Why `call/cc` Needs a Continuation

`call-with-current-continuation` does not merely call a function and return its result. It captures the current continuation: the work that remains after the call has produced a value.

For example, in:

```scheme
(+ 10 (call/cc (lambda (k) ...)))
```

the continuation includes the pending addition of `10`. If `k` is called later, the value passed to `k` must be supplied to the captured call site and the addition must continue from there.

The original implementation used a JavaScript exception as an escape mechanism. That handled one-way exits, but it could not resume the expression that surrounded the original `call/cc`. It therefore failed for the R5RS `dynamic-wind` example, where a continuation is saved and called later.

## 6. Current Continuation Support

The current implementation adds two evaluator-level pieces of state:

```javascript
FsEvaluator.currentContinuation
FsEvaluator.currentWindBefore
```

`currentContinuation` is a JavaScript callback representing the Scheme work that is still pending. `evalWithContinuation` temporarily installs a callback while evaluating a nested expression and restores the previous callback afterward:

```javascript
static evalWithContinuation (sexp, env, continuation) {
  const previousContinuation = FsEvaluator.currentContinuation
  FsEvaluator.currentContinuation = continuation
  try {
    return FsEvaluator.eval(sexp, env)
  } finally {
    FsEvaluator.currentContinuation = previousContinuation
  }
}
```

The `finally` block is essential. Evaluations are nested, and an inner expression must not permanently replace the continuation belonging to its caller.

Argument evaluation uses this mechanism to preserve the rest of a procedure application. When an argument produces a value, the callback:

1. stores the value in the argument list,
2. evaluates any remaining arguments,
3. applies the procedure,
4. passes the result to the parent continuation.

This is the key step that allows a continuation to return to an enclosing application instead of stopping at the argument expression.

## 7. `call/cc` Implementation

`FspCallCc` creates a generated symbol and binds it to a procedure representing the captured continuation. The generated symbol is an implementation detail and prevents collisions with user-defined names.

Calling the generated procedure extracts its first argument and passes it to the captured continuation:

```javascript
const throwBack = (callArgs, callEnv) => {
  const value = callArgs.at(0)
  return continuation(value)
}
```

For compatibility with the previous evaluator, an exception-based escape callback is still used when no resumable evaluator continuation is available. This preserves the existing one-way escape behavior used by the older `call/cc` tests while resumable continuations are used in the supported `dynamic-wind` path.

The important design boundary is that the choice is made by `FsEvaluator.captureContinuation`, not by the procedure body itself. `FspCallCc` always invokes the continuation it receives.

## 8. `dynamic-wind` Implementation

`dynamic-wind` has three parts:

1. `before`: runs when entering the dynamic extent.
2. `thunk`: runs while inside the dynamic extent.
3. `after`: runs when leaving the dynamic extent.

The implementation keeps `after` in a callable `runAfter` function so it can be executed both on ordinary completion and when a saved continuation leaves the dynamic extent.

When the thunk is active, `currentWindBefore` is replaced with a callback that runs the `before` expression. A continuation captured inside the thunk can call this callback when it re-enters the dynamic extent.

The outer continuation is saved before the thunk starts. After `after` runs, the thunk result is passed back to that outer continuation. This is what lets the R5RS example continue with the expression following `dynamic-wind`.

Exceptions from the thunk are not silently discarded. The `after` expression still runs, and the original exception is rethrown afterward.

## 9. R5RS 6.4.8 Control Flow

The regression test in `test/r5rs.6.4_8.test.js` captures the intended behavior:

```scheme
(let ((path '())
      (c #f))
  (let ((add (lambda (s)
               (set! path (cons s path)))))
    (dynamic-wind
      (lambda () (add 'connect))
      (lambda ()
        (add (call-with-current-continuation
               (lambda (c0)
                 (set! c c0)
                 'talk1))))
      (lambda () (add 'disconnect)))
    (if (< (length path) 4)
        (c 'talk2)
        (reverse path))))
```

The expected result is:

```text
(connect talk1 disconnect connect talk2 disconnect)
```

The order demonstrates all required transitions:

- initial entry runs `connect`,
- the first thunk run adds `talk1`,
- leaving the first dynamic extent adds `disconnect`,
- invoking the saved continuation re-enters and adds `connect`,
- the continuation supplies `talk2`,
- final exit adds `disconnect`.

## 10. Files Changed for This Work

### `src/evaluator.js`

- Added evaluator continuation state.
- Added `evalWithContinuation` for nested evaluations.
- Added `captureContinuation` as the central continuation-selection boundary.
- Preserved continuations across procedure argument evaluation.
- Added multi-expression lambda body handling.

### `src/sexp.js`

- Updated `FslsLet` body evaluation to preserve sequence continuations.
- Updated `FspCallCc` to invoke the evaluator-provided continuation.
- Updated `FspDynamicWind` to return the thunk value.
- Ensured `after` runs on normal and exceptional exits.
- Added re-entry support for `before`.

## 11. Validation

The current test suite passes with:

```text
94 test suites passed
427 tests passed
```

Important focused tests include:

```bash
npm test -- --runInBand test/r5rs.6.4_8.test.js test/proc.call-cc.test.js
```

The full suite is:

```bash
npm test -- --runInBand
```

## 12. Known Limitations and Future Work

The evaluator is not yet a fully general explicit continuation machine. Continuation support is integrated into the existing recursive helper structure, so the following areas deserve future work:

- replace the remaining global evaluator state with a per-evaluation machine object,
- represent continuations as explicit immutable frame stacks,
- represent nested `dynamic-wind` extents as a wind stack rather than one callback,
- make `map`, `apply`, and `call-with-values` use the same continuation-aware application path,
- remove the compatibility fallback once all procedure applications use explicit continuations,
- add tests for nested `dynamic-wind`, continuations called multiple times, and continuation transfers across multiple wind extents.

These limitations are documented because passing the current regression tests does not by itself prove full R5RS continuation semantics.
