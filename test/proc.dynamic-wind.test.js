'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating macro', () => {
  const code = `
  (let ((buf ()))
  (dynamic-wind
    (lambda () (set! buf (cons '1 buf)))
    (lambda () (set! buf (cons '2 buf)))
    (lambda () (set! buf (cons '3 buf)))
    )
  (reverse buf))
  `
  expect(new FBS().eval(code).toString()).toBe('(1 2 3)')
})

test('evaluating macro in (begin of top-level', () => {
  const code = `
  (begin
  (define-macro and1 (lambda args
    (if (null? args) #t
        (if (= (length args) 1) (car args)
            \`(if ,(car args) (and ,@(cdr args)) #f)))))
  (define-macro and2 (lambda args
    (if (null? args) #t
        (if (= (length args) 1) (car args)
            \`(if ,(car args) (and ,@(cdr args)) #f)))))
  )
  `
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('(and1 #t #t')).toStrictEqual(FsBoolean.TRUE)
  expect(fbs.eval('(and1 #t #f')).toStrictEqual(FsBoolean.FALSE)
  expect(fbs.eval('(and1 #f #t')).toStrictEqual(FsBoolean.FALSE)
  expect(fbs.eval('(and1 #f #f')).toStrictEqual(FsBoolean.FALSE)

  expect(fbs.eval('(and2 #t #t')).toStrictEqual(FsBoolean.TRUE)
  expect(fbs.eval('(and2 #t #f')).toStrictEqual(FsBoolean.FALSE)
  expect(fbs.eval('(and2 #f #t')).toStrictEqual(FsBoolean.FALSE)
  expect(fbs.eval('(and2 #f #f')).toStrictEqual(FsBoolean.FALSE)
})
