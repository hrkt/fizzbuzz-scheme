// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-2.html#%_toc_start

// 1. expected value is taken from R5RS.
// 2. when returned value is "unspecivied" in R5RS, follow the rules below
//    (a) returns same value from Gauche

'use strict'

import { jest } from '@jest/globals'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsPromise, FssDefinedProcedure, FsUndefined } from '../src/sexp.js'

// 1. Overview of scheme
// all cleared 😊

// all cleared 😊
test('✅1.3.4', () => {
  const code = '(* 5 8)'
  expect(new FBS().eval(code).toString()).toBe('40')
})

// 2. Lexical conventions
// all cleared 😊

// all cleared 😊
test('✅2.2', () => {
  const code = `;;; The FACT procedure computes the factorial
  ;;; of a non-negative integer.
  (define fact
    (lambda (n)
      (if (= n 0)
          1        ;Base case: return 1
          (* n (fact (- n 1))))))
  (fact 10)
  `

  expect(new FBS().eval(code).toString()).toBe('3628800')
})

// 2.3  Other notations
// will be covered with tests in chapters hereafter

// 3. Basic concepts
// no example 😊

// 4. Expressions

// all cleared 😊
test('✅4.1.1', () => {
  const fbs = new FBS()
  fbs.eval('(define x 28)')
  expect(fbs.eval('x').toString()).toBe('28')
})

// all cleared 😊
test('✅4.1.2', () => {
  expect(new FBS().eval('(quote a)').toString()).toBe('a')
  expect(new FBS().eval('(quote #(a b c))').toString()).toBe('#(a b c)')
  expect(new FBS().eval('(quote (+ 1 2))').toString()).toBe('(+ 1 2)')

  expect(new FBS().eval('\'a').toString()).toBe('a')
  expect(new FBS().eval('\'#(a b c) ').toString()).toBe('#(a b c)')
  expect(new FBS().eval('\'()').toString()).toBe('()')
  expect(new FBS().eval('\'(+ 1 2)').toString()).toBe('(+ 1 2)')
  expect(new FBS().eval('\'(quote a)').toString()).toBe('(quote a)')
  // expect(new FBS().eval('\'\'a').toString()).toBe('(quote a)')
  expect(new FBS().eval('\'\'a').toString()).toBe('\'a') // same value as above

  expect(new FBS().eval('\'"abc"').toString()).toBe('"abc"')
  expect(new FBS().eval('"abc"').toString()).toBe('"abc"')
  expect(new FBS().eval('\'145932').toString()).toBe('145932')
  expect(new FBS().eval('145932').toString()).toBe('145932')
  expect(new FBS().eval('\'#t').toString()).toBe('#t')
  expect(new FBS().eval('#t').toString()).toBe('#t')
})

// all cleared 😊
test('✅4.1.3', () => {
  expect(new FBS().eval('(+ 3 4)').toString()).toBe('7')
  expect(new FBS().eval('((if #f + *) 3 4)').toString()).toBe('12')
})

// all cleared 😊
test('✅4.1.4', () => {
  const fbs = new FBS()
  expect(fbs.eval('(lambda (x) (+ x x))') instanceof FssDefinedProcedure).toBe(true)

  expect(new FBS().eval('((lambda (x) (+ x x)) 4)').toString()).toBe('8')

  {
    const code = `(define reverse-subtract
      (lambda (x y) (- y x)))
    (reverse-subtract 7 10)
    `
    expect(new FBS().eval(code).toString()).toBe('3')
  }

  {
    const code = `(define add4
      (let ((x 4))
        (lambda (y) (+ x y))))
    (add4 6)
    `
    expect(new FBS().eval(code).toString()).toBe('10')
  }

  expect(new FBS().eval('((lambda x x) 3 4 5 6)').toString()).toBe('(3 4 5 6)')
  expect(new FBS().eval('((lambda (x y . z) z) 3 4 5 6)').toString()).toBe('(5 6)')
})

// all cleared 😊
test('✅4.1.5', () => {
  expect(new FBS().eval('(if (> 3 2) \'yes \'no)').toString()).toBe('yes')
  expect(new FBS().eval('(if (> 2 3) \'yes \'no)').toString()).toBe('no')
  {
    const code = `(if (> 3 2)
    (- 3 2)
    (+ 3 2))
    `
    expect(new FBS().eval(code).toString()).toBe('1')
  }
})

// all cleared 😊
test('✅4.1.6', () => {
  const fbs = new FBS()
  fbs.eval('(define x 2)')
  expect(fbs.eval('(+ x 1)').toString()).toBe('3')
  fbs.eval('(set! x 4)') // unspecified
  expect(fbs.eval('(+ x 1)').toString()).toBe('5')
})

test('🚧4.2.1_1', () => {
  const fbs = new FBS()
  fbs.eval('(define x 2)')
  expect(fbs.eval('(+ x 1)').toString()).toBe('3')
  fbs.eval('(set! x 4)') // unspecified
  expect(fbs.eval('(+ x 1)').toString()).toBe('5')
})

test('🚧4.2.1_2', () => {
  expect(new FBS().eval('(or (= 2 2) (< 2 1))').toString()).toBe('#t')
  expect(new FBS().eval('(or (= 2 2) (< 2 1))').toString()).toBe('#t')
  expect(new FBS().eval('(or #f #f #f)').toString()).toBe('#f')
  // expect(new FBS().eval('(or (memq \'b \'(a b c)) (/ 3 0))').toString()).toBe('(b c)')
})

// all cleared 😊
test('✅4.2.2', () => {
  expect(new FBS().eval('(let ((x 2) (y 3)) (* x y))').toString()).toBe('6')
  const code1 = `(let ((x 2) (y 3))
    (let ((x 7)
          (z (+ x y)))
      (* z x)))`
  expect(new FBS().eval(code1).toString()).toBe('35')

  const code2 = `(let ((x 2) (y 3))
  (let* ((x 7)
         (z (+ x y)))
    (* z x)))`
  expect(new FBS().eval(code2).toString()).toBe('70')

  const code3 = `(letrec ((even?
    (lambda (n)
      (if (zero? n)
          #t
          (odd? (- n 1)))))
   (odd?
    (lambda (n)
      (if (zero? n)
          #f
          (even? (- n 1))))))
  (even? 88))`
  expect(new FBS().eval(code3).toString()).toBe('#t')
})

// all cleared 😊
test('✅4.2.3_1', () => {
  const code = `
  (define x 0)
  (begin (set! x 5)
       (+ x 1))
  `
  expect(new FBS().eval(code).toString()).toBe('6')
})

// all cleared 😊
test('✅4.2.3_2', () => {
  const code = `
  (begin (display "4 plus 1 equals ")
  (display (+ 4 1)))
  `

  const mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => {})
  const fbs = new FBS()
  fbs.eval(code)
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(1, '4 plus 1 equals ')
  expect(mockStdoutWrite).toHaveBeenNthCalledWith(2, '5')
  mockStdoutWrite.mockRestore()
})

// all cleared 😊
test('✅4.2.4', () => {
  const code1 = `
  (do ((vec (make-vector 5))
     (i 0 (+ i 1)))
    ((= i 5) vec)
  (vector-set! vec i i))
  `
  expect(new FBS().eval(code1).toString()).toBe('#(0 1 2 3 4)')

  const code2 = `
  (let ((x '(1 3 5 7 9)))
  (do ((x x (cdr x))
       (sum 0 (+ sum (car x))))
      ((null? x) sum)))
  `
  expect(new FBS().eval(code2).toString()).toBe('25')

  const code3 = `(let loop ((numbers '(3 -2 1 6 -5))
  (nonneg '())
  (neg '()))
  (cond ((null? numbers) (list nonneg neg))
  ((>= (car numbers) 0)
  (loop (cdr numbers)
      (cons (car numbers) nonneg)
      neg))
  ((< (car numbers) 0)
  (loop (cdr numbers)
      nonneg
      (cons (car numbers) neg)))))`

  expect(new FBS().eval(code3).toString()).toBe('((6 1 3) (-5 -2))')
})

// all cleared 😊
test('✅4.2.6', () => {
  expect(new FBS().eval('`(list ,(+ 1 2) 4)').toString()).toBe('(list 3 4)')
  // expect(new FBS().eval('(let ((name \'a)) `(list ,name \',name))').toString()).toBe('(list a (quote a))')
  expect(new FBS().eval('(let ((name \'a)) `(list ,name \',name))').toString()).toBe('(list a \'a)')

  expect(new FBS().eval('`(a `(b ,(+ 1 2) ,(foo ,(+ 1 3) d) e) f)').toString()).toBe('(a `(b ,(+ 1 2) ,(foo 4 d) e) f)')
  const code = `
  (let ((name1 'x)
  (name2 'y))
  \`(a \`(b ,,name1 ,',name2 d) e))
  `
  expect(new FBS().eval(code).toString()).toBe('(a `(b ,x ,\'y d) e)')

  expect(new FBS().eval('`(a ,(+ 1 2) ,@(map abs \'(4 -5 6)) b)').toString()).toBe('(a 3 4 5 6 b)')
  expect(new FBS().eval('`(( foo ,(- 10 3)) ,@(cdr \'(c)) . ,(car \'(cons)))').toString()).toBe('((foo 7) . cons)')
  expect(new FBS().eval('`#(10 5 ,(sqrt 4) ,@(map sqrt \'(16 9)) 8) ').toString()).toBe('#(10 5 2 4 3 8)')

  expect(new FBS().eval('(quasiquote (list (unquote (+ 1 2)) 4))').toString()).toBe('(list 3 4)')
  // expect(new FBS().eval('(quasiquote (list (unquote (+ 1 2)) 4))').toString()).toBe('`(list ,(+ 1 2) 4)') //  may vary between implementations.
  expect(new FBS().eval('\'(quasiquote (list (unquote (+ 1 2)) 4))').toString()).toBe('(quasiquote (list (unquote (+ 1 2)) 4))')
})

test('🚧4.3.2', () => {
  const code1 = `(let ((=> #f))
  (cond (#t => 'ok)))`
  expect(new FBS().eval(code1).toString()).toBe('ok')

  const code2 = `(let ((=> #f))
  (if #t (begin => 'ok)))`
  expect(new FBS().eval(code2).toString()).toBe('ok')
})

// 5. Program structure

// 6. Standard procedures

test('✅6.1_1', () => {
  expect(new FBS().eval('(eqv? \'a \'a)').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? \'a \'b) ').toString()).toBe('#f')
  expect(new FBS().eval('(eqv? 2 2)').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? \'() \'())').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? 100000000 100000000)').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? (cons 1 2) (cons 1 2))').toString()).toBe('#f')
  expect(new FBS().eval('(eqv? (lambda () 1) (lambda () 2))').toString()).toBe('#f')
  expect(new FBS().eval('(eqv? #f \'nil)').toString()).toBe('#f')
  expect(new FBS().eval('(let ((p (lambda (x) x))) (eqv? p p))').toString()).toBe('#t')

  expect(new FBS().eval('(eqv? "" "")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eqv? \'#() \'#())').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eqv? (lambda (x) x) (lambda (x) x))').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eqv? (lambda (x) x) (lambda (y) y))').toString()).toBe('#f') // unspecified

  {
    const fbs = new FBS()
    fbs.eval(`(define gen-counter
      (lambda ()
        (let ((n 0))
          (lambda () (set! n (+ n 1)) n))))`)
    expect(fbs.eval('(let ((g (gen-counter))) (eqv? g g))').toString()).toBe('#t')
    expect(fbs.eval('(eqv? (gen-counter) (gen-counter))').toString()).toBe('#f')
  }

  {
    const fbs = new FBS()
    fbs.eval(`(define gen-loser
      (lambda ()
        (let ((n 0))
          (lambda () (set! n (+ n 1)) 27))))`)
    expect(fbs.eval('(let ((g (gen-loser))) (eqv? g g))').toString()).toBe('#t')
    expect(fbs.eval('(eqv? (gen-loser) (gen-loser))').toString()).toBe('#f')
  }

  expect(new FBS().eval(`(letrec ((f (lambda () (if (eqv? f g) 'both 'f)))
    (g (lambda () (if (eqv? f g) 'both 'g))))
(eqv? f g))`).toString()).toBe('#f') // unspecified

  expect(new FBS().eval(`(letrec ((f (lambda () (if (eqv? f g) 'f 'both)))
  (g (lambda () (if (eqv? f g) 'g 'both))))
  (eqv? f g))`).toString()).toBe('#f')

  expect(new FBS().eval('(eqv? \'(a) \'(a))').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eqv? "a" "a")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eqv? \'(b) (cdr \'(a b)))').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(let ((x \'(a))) (eqv? x x))').toString()).toBe('#f')

  expect(new FBS().eval('(eqv? #t #t)').toString()).toBe('#t')

  // eq? checks 2 objects point the same point of memory
  expect(new FBS().eval('(eqv? #t #t)').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? #f #f)').toString()).toBe('#t')

  expect(new FBS().eval('(eqv? \'a \'a)').toString()).toBe('#t')
  expect(new FBS().eval('(eqv? \'a \'b)').toString()).toBe('#f')
})

// procedure (eq? block
// all cleared 😊
test('✅6.1_2', () => {
  // eq? checks 2 objects point the same point of memory
  expect(new FBS().eval('(eq? \'a \'a)').toString()).toBe('#t')
  expect(new FBS().eval('(eq? \'(a) \'(a))').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? (list \'a) (list \'a))').toString()).toBe('#f')
  expect(new FBS().eval('(eq? "a" "a")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? "" "")').toString()).toBe('#f') // unspecified
  expect(new FBS().eval('(eq? \'() \'())').toString()).toBe('#t')
  expect(new FBS().eval('(eq? 2 2)').toString()).toBe('#t') // unspecified
  expect(new FBS().eval('(eq? #\\A #\\A)').toString()).toBe('#t')// unspecified
  expect(new FBS().eval('(eq? car car)').toString()).toBe('#t')
  expect(new FBS().eval('(let ((n (+ 2 3))) (eq? n n)) ').toString()).toBe('#t') // unspecified
  expect(new FBS().eval('(let ((x \'(a))) (eq? x x))').toString()).toBe('#t')
  expect(new FBS().eval('(let ((x \'#())) (eq? x x))').toString()).toBe('#t')
  expect(new FBS().eval('(let ((p (lambda (x) x))) (eq? p p))').toString()).toBe('#t')
})

// all cleared 😊
test('✅6.1_3', () => {
  expect(new FBS().eval('(equal? \'a \'a) ').toString()).toBe('#t')
  expect(new FBS().eval('(equal? \'(a) \'(a)) ').toString()).toBe('#t')
  expect(new FBS().eval('(equal? \'(a (b) c) \'(a (b) c))').toString()).toBe('#t')
  expect(new FBS().eval('(equal? "abc" "abc")').toString()).toBe('#t')
  expect(new FBS().eval('(equal? 2 2)').toString()).toBe('#t')
  expect(new FBS().eval('(equal? (make-vector 5 \'a) (make-vector 5 \'a))').toString()).toBe('#t')
  expect(new FBS().eval('(equal? (lambda (x) x) (lambda (y) y))').toString()).toBe('#f') // unspecified
})

// test('🚧..', () => {
//   expect(new FBS().eval('').toString()).toBe('')
// })

// 6.2.5
// all cleared 😊
test('✅6.2.5_1', () => {
  expect(new FBS().eval('(complex? 3+4i)').toString()).toBe('#t')
  expect(new FBS().eval('(complex? 3)').toString()).toBe('#t')
  expect(new FBS().eval('(real? 3)').toString()).toBe('#t')
  expect(new FBS().eval('(real? -2.5+0.0i)').toString()).toBe('#t')
  expect(new FBS().eval('(real? #e1e10)').toString()).toBe('#t')
  expect(new FBS().eval('(rational? 6/10)').toString()).toBe('#t')
  expect(new FBS().eval('(rational? 6/3)').toString()).toBe('#t')
  expect(new FBS().eval('(integer? 3+0i)').toString()).toBe('#t')
  expect(new FBS().eval('(integer? 3.0)').toString()).toBe('#t')
  expect(new FBS().eval('(integer? 8/4)').toString()).toBe('#t')
})

test('✅6.2.5_2', () => {
  expect(new FBS().eval('(max 3 4)').toString()).toBe('4')
  expect(new FBS().eval('(max 3.9 4)').toString()).toBe('4.0')

  const code = `(= n1 (+ (* n2 (quotient n1 n2))
           (remainder n1 n2)))`
  const fbs = new FBS()
  fbs.eval('(define n1 8)')
  fbs.eval('(define n2 3)')
  expect(fbs.eval(code).toString()).toBe('#t')

  expect(new FBS().eval('(modulo 13 4)').toString()).toBe('1')
  expect(new FBS().eval('(remainder 13 4)').toString()).toBe('1')
  expect(new FBS().eval('(modulo -13 4)').toString()).toBe('3')
  expect(new FBS().eval('(remainder -13 4)').toString()).toBe('-1')
  expect(new FBS().eval('(modulo 13 -4)').toString()).toBe('-3')
  expect(new FBS().eval('(remainder 13 -4)').toString()).toBe('1')
  expect(new FBS().eval('(modulo -13 -4)').toString()).toBe('-1')
  expect(new FBS().eval('(remainder -13 -4)').toString()).toBe('-1')
  expect(new FBS().eval('(remainder -13 -4.0)').toString()).toBe('-1.0')
})

test('✅6.2.5_3', () => {
  expect(new FBS().eval('(+ 3 4)').toString()).toBe('7')
  expect(new FBS().eval('(+)').toString()).toBe('0')
  expect(new FBS().eval('(* 4)').toString()).toBe('4')
  expect(new FBS().eval('(*)').toString()).toBe('1')

  expect(new FBS().eval('(abs -7)').toString()).toBe('7')

  expect(new FBS().eval('(gcd 32 -36)').toString()).toBe('4')
  expect(new FBS().eval('(gcd)').toString()).toBe('0')
  expect(new FBS().eval('(lcm 32 -36)').toString()).toBe('288')
  expect(new FBS().eval('(lcm 32.0 -36)').toString()).toBe('288.0')
  expect(new FBS().eval('(lcm)').toString()).toBe('1')

  expect(new FBS().eval('(numerator (/ 6 4))').toString()).toBe('3')
  expect(new FBS().eval('(denominator (/ 6 4)) ').toString()).toBe('2')
  expect(new FBS().eval('(denominator (exact->inexact (/ 6 4)))').toString()).toBe('2.0')
})

test('✅6.2.5_4', () => {
  expect(new FBS().eval('(floor -4.3)').toString()).toBe('-5.0')
  expect(new FBS().eval('(ceiling -4.3) ').toString()).toBe('-4.0')
  expect(new FBS().eval('(truncate -4.3) ').toString()).toBe('-4.0')
  expect(new FBS().eval('(round -4.3)').toString()).toBe('-4.0')
  expect(new FBS().eval('(floor 3.5)').toString()).toBe('3.0')
  expect(new FBS().eval('(ceiling 3.5)').toString()).toBe('4.0')
  expect(new FBS().eval('(truncate 3.5)').toString()).toBe('3.0')
  expect(new FBS().eval('(round 3.5)').toString()).toBe('4.0')
  expect(new FBS().eval('(round 7/2)').toString()).toBe('4')
  expect(new FBS().eval('(round 7)').toString()).toBe('7')
})

test('✅6.2.5_5', () => {
  expect(new FBS().eval('(rationalize (inexact->exact .3) 1/10)').toString()).toBe('1/3')
  expect(new FBS().eval('(rationalize .3 1/10) ').toString()).toBe('#i1/3')
})

test('✅6.2.6', () => {
  const code = `(let ((number 100)
  (radix 16))
  (eqv? number
  (string->number (number->string 100
  16)
  16)))`
  expect(new FBS().eval(code).toString()).toBe('#t')

  expect(new FBS().eval('(string->number "100")').toString()).toBe('100')
  expect(new FBS().eval('(string->number "100" 16)').toString()).toBe('256')
  expect(new FBS().eval('(string->number "1e2")').toString()).toBe('100.0')
  expect(new FBS().eval('(string->number "15##")').toString()).toBe('1500')
})

// all cleared 😊
test('✅6.3.1', () => {
  expect(new FBS().eval('#t').toString()).toBe('#t')
  expect(new FBS().eval('#f').toString()).toBe('#f')
  expect(new FBS().eval('\'#f').toString()).toBe('#f')

  // library procedure not
  expect(new FBS().eval('(not #t)').toString()).toBe('#f')
  expect(new FBS().eval('(not 3)').toString()).toBe('#f')
  expect(new FBS().eval('(not (list 3))').toString()).toBe('#f')
  expect(new FBS().eval('(not #f)').toString()).toBe('#t')
  expect(new FBS().eval('(not \'())').toString()).toBe('#f')
  expect(new FBS().eval('(not (list))').toString()).toBe('#f')
  expect(new FBS().eval('(not \'nil)').toString()).toBe('#f')
  expect(new FBS().eval('\'#f').toString()).toBe('#f')

  // library procedure boolean?
  expect(new FBS().eval('(boolean? #f)').toString()).toBe('#t')
  expect(new FBS().eval('(boolean? 0)').toString()).toBe('#f')
  expect(new FBS().eval('(boolean? \'())').toString()).toBe('#f')
})

// all cleared 😊
test('✅6.3.2_1', () => {
  const fbs = new FBS()
  fbs.eval('(define x (list \'a \'b \'c))')
  fbs.eval('(define y x)')

  expect(fbs.eval('y').toString()).toBe('(a b c)')
  expect(fbs.eval('(list? y)').toString()).toBe('#t')
  fbs.eval('(set-cdr! x 4)') // unspecified
  expect(fbs.eval('x').toString()).toBe('(a . 4)')
  expect(fbs.eval('(eqv? x y)').toString()).toBe('#t')
  expect(fbs.eval('y').toString()).toBe('(a . 4)')
  expect(fbs.eval('(list? y)').toString()).toBe('#f')
  expect(fbs.eval('(set-cdr! x x)').toString()).toBe(FsUndefined.UNDEFINED.toString())
  expect(fbs.eval('(list? x)').toString()).toBe('#f')
})

test('✅6.3.2_2', () => {
  expect(new FBS().eval('(pair? \'(a . b))').toString()).toBe('#t')
  expect(new FBS().eval('(pair? \'(a b c))').toString()).toBe('#t')
  expect(new FBS().eval('(pair? \'())').toString()).toBe('#f')
  expect(new FBS().eval('(pair? \'#(a b))').toString()).toBe('#f')

  expect(new FBS().eval('(cons \'a \'())').toString()).toBe('(a)')
  expect(new FBS().eval('(cons \'(a) \'(b c d))').toString()).toBe('((a) b c d)')
  expect(new FBS().eval('(cons "a" \'(b c))').toString()).toBe('("a" b c)')
  expect(new FBS().eval('(cons \'a 3)').toString()).toBe('(a . 3)')
  expect(new FBS().eval('(cons \'(a b) \'c)').toString()).toBe('((a b) . c)')
})

test('✅6.3.2_3', () => {
  expect(new FBS().eval('(cons \'a \'())').toString()).toBe('(a)')
  expect(new FBS().eval('(cons \'(a) \'(b c d))').toString()).toBe('((a) b c d)')
  expect(new FBS().eval('(cons "a" \'(b c))').toString()).toBe('("a" b c)')
  expect(new FBS().eval('(cons \'a 3)').toString()).toBe('(a . 3)')
  expect(new FBS().eval('(cons \'(a b) \'c)').toString()).toBe('((a b) . c)')

  expect(new FBS().eval('(car \'(a b c))').toString()).toBe('a')
  expect(new FBS().eval('(car \'((a) b c d))').toString()).toBe('(a)')
  expect(new FBS().eval('(car \'(1 . 2))').toString()).toBe('1')
  expect(() => { new FBS().eval('car \'())') }).toThrow(FsException)

  expect(new FBS().eval('(cdr \'((a) b c d)) ').toString()).toBe('(b c d)')
  expect(new FBS().eval('(cdr \'(1 . 2)) ').toString()).toBe('2')
  expect(() => { new FBS().eval('cdr \'())') }).toThrow(FsException)
})

test('✅6.3.2_4', () => {
  expect(new FBS().eval('(caar \'((1 . 2) . 3))').toString()).toBe('1')
  expect(new FBS().eval('(cadr \'((1 . 2) . (3 . 4)))').toString()).toBe('3')
})

test('✅6.3.2_5', () => {
  expect(new FBS().eval('(null? ())').toString()).toBe('#t')
  expect(new FBS().eval('(null? \'(1 2))').toString()).toBe('#f')

  expect(new FBS().eval('(list? \'(a b c))').toString()).toBe('#t')
  expect(new FBS().eval('(list? \'())').toString()).toBe('#t')
  expect(new FBS().eval('(list? \'(a . b))').toString()).toBe('#f')
  expect(new FBS().eval('(let ((x (list \'a))) (set-cdr! x x) (list? x))').toString()).toBe('#f')

  expect(new FBS().eval('(list \'a (+ 3 4) \'c)').toString()).toBe('(a 7 c)')
  expect(new FBS().eval('(list)').toString()).toBe('()')

  expect(new FBS().eval('(length \'(a b c))').toString()).toBe('3')
  expect(new FBS().eval('(length \'(a (b) (c d e)))').toString()).toBe('3')
  expect(new FBS().eval('(length \'())').toString()).toBe('0')
})

test('✅6.3.2_6', () => {
  expect(new FBS().eval('(append \'(x) \'(y))').toString()).toBe('(x y)')
  expect(new FBS().eval('(append \'(a) \'(b c d))').toString()).toBe('(a b c d)')
  expect(new FBS().eval('(append \'(a (b)) \'((c)))').toString()).toBe('(a (b) (c))')

  expect(new FBS().eval('(append \'(a b) \'(c . d))').toString()).toBe('(a . (b . (c . d)))') // === (a b c . d)
  expect(new FBS().eval('(append \'() \'a)').toString()).toBe('a')

  expect(new FBS().eval('(reverse \'(a b c))').toString()).toBe('(c b a)')
  expect(new FBS().eval('(reverse \'(a (b c) d (e (f))))').toString()).toBe('((e (f)) d (b c) a)')
  expect(new FBS().eval('(list-ref \'(a b c d) 2)').toString()).toBe('c')
  expect(new FBS().eval('(list-ref \'(a b c d) (inexact->exact (round 1.8)))').toString()).toBe('c')
  expect(new FBS().eval('(memq \'a \'(a b c))').toString()).toBe('(a b c)')
  expect(new FBS().eval('(memq \'b \'(a b c))').toString()).toBe('(b c)')
  expect(new FBS().eval('(memq \'a \'(b c d))').toString()).toBe('#f')
  expect(new FBS().eval('(memq (list \'a) \'(b (a) c))').toString()).toBe('#f')
  expect(new FBS().eval('(member (list \'a) \'(b (a) c))').toString()).toBe('((a) c)')
  expect(new FBS().eval('(memq 101 \'(100 101 102))').toString()).toBe('(101 102)') // unspecified
  expect(new FBS().eval('(memv 101 \'(100 101 102))').toString()).toBe('(101 102)')

  const fbs = new FBS()
  fbs.eval('(define e \'((a 1) (b 2) (c 3)))')
  expect(fbs.eval('(assq \'a e)').toString()).toBe('(a 1)')
  expect(fbs.eval('(assq \'b e)').toString()).toBe('(b 2)')
  expect(fbs.eval('(assq \'d e)').toString()).toBe('#f')
  expect(fbs.eval('(assq (list \'a) \'(((a)) ((b)) ((c))))').toString()).toBe('#f')
  expect(fbs.eval('(assoc (list \'a) \'(((a)) ((b)) ((c))))').toString()).toBe('((a))')
  expect(fbs.eval('(assq 5 \'((2 3) (5 7) (11 13)))').toString()).toBe('(5 7)')
  expect(fbs.eval('(assv 5 \'((2 3) (5 7) (11 13)))').toString()).toBe('(5 7)')
  // expect(new FBS().eval('').toString()).toBe('')
})

// all cleared 😊
// 6.3.3  Symbols
test('✅6.3.3', () => {
  expect(new FBS().eval('(symbol? \'foo)').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? (car \'(a b))) ').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? "bar")').toString()).toBe('#f')
  expect(new FBS().eval('(symbol? \'nil)').toString()).toBe('#t')
  expect(new FBS().eval('(symbol? \'())').toString()).toBe('#f')
  expect(new FBS().eval('(symbol? #f)').toString()).toBe('#f')

  expect(new FBS().eval('(symbol->string \'flying-fish)').toString()).toBe('"flying-fish"')
  expect(new FBS().eval('(symbol->string \'Martin)').toString()).toBe('"Martin"') // implementation's preferrence
  expect(new FBS().eval('(symbol->string (string->symbol "Malvina"))').toString()).toBe('"Malvina"')

  // implementation's preferrence. same behavior as Gauche
  expect(new FBS().eval('(eq? \'mISSISSIppi \'mississippi) ').toString()).toBe('#f')
  expect(new FBS().eval('(string->symbol "mISSISSIppi")').toString()).toBe('mISSISSIppi')
  expect(new FBS().eval('(eq? \'bitBlt (string->symbol "bitBlt"))').toString()).toBe('#t')
  expect(new FBS().eval('(eq? \'JollyWog (string->symbol (symbol->string \'JollyWog)))').toString()).toBe('#t')
  expect(new FBS().eval('(string=? "K. Harper, M.D." (symbol->string (string->symbol "K. Harper, M.D.")))').toString()).toBe('#t')
})

// all cleared 😊
// 6.3.4  Characters
test('✅6.3.4', () => {
  expect(new FBS().eval('(<= (char->integer #\\a) (char->integer #\\b))').toString()).toBe('#t')
  expect(new FBS().eval('(char<=? (integer->char 97) (integer->char 98))').toString()).toBe('#t')
})

// 6.3.5  Strings
test('✅6.3.5', () => {
  const fbs = new FBS()
  fbs.eval('(define (f) (make-string 3 #\\*))')
  fbs.eval('(define (g) "***")')
  expect(fbs.eval('(string-set! (f) 0 #\\?)').toString()).toBe('"?**"') // unspecified
  expect(() => { fbs.eval('(string-set! (g) 0 #\\?)') }).toThrow(FsException)
  expect(() => { fbs.eval('(string-set! (symbol->string \'immutable) 0 #\\?)') }).toThrow(FsException)
})

// 6.3.6  Vectors
test('✅6.3.6', () => {
  expect(new FBS().eval('#(0 (2 2 2 2) "Anna")').toString()).toBe('#(0 (2 2 2 2) "Anna")')
  expect(new FBS().eval('(vector \'a \'b \'c)').toString()).toBe('#(a b c)')
  expect(new FBS().eval('(vector? (vector \'a \'b \'c))').toString()).toBe('#t') // additional: from its definition
  expect(new FBS().eval('(vector-ref \'#(1 1 2 3 5 8 13 21) 5)').toString()).toBe('8')

  const code = `
  (let ((vec (vector 0 '(2 2 2 2) "Anna")))
  (vector-set! vec 1 '("Sue" "Sue"))
  vec)`
  expect(new FBS().eval(code).toString()).toBe('#(0 ("Sue" "Sue") "Anna")')

  // gauche, mit-scheme does not seems to throw error, while r5rs spec throws error.
  // trying to follow spec.
  expect(() => { new FBS().eval('(vector-set! \'#(0 1 2) 1 "doe") ') }).toThrow(FsException)

  expect(new FBS().eval('(vector->list \'#(dah dah didah))').toString()).toBe('(dah dah didah)')
  expect(new FBS().eval('(list->vector \'(dididit dah))').toString()).toBe('#(dididit dah)')
})

// 6.4  Control features
test('✅6.4_1', () => {
  expect(new FBS().eval('(procedure? car)').toString()).toBe('#t')
  expect(new FBS().eval('(procedure? \'car)').toString()).toBe('#f')
  expect(new FBS().eval('(procedure? (lambda (x) (* x x)))').toString()).toBe('#t')
  expect(new FBS().eval('(procedure? \'(lambda (x) (* x x)))').toString()).toBe('#f')
  expect(new FBS().eval('(call-with-current-continuation procedure?)').toString()).toBe('#t')

  expect(new FBS().eval('(apply + (list 3 4))').toString()).toBe('7')

  const code = `(define compose
    (lambda (f g)
      (lambda args
        (f (apply g args)))))`
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('((compose sqrt *) 12 75)').toString()).toBe('30')
})

test('✅6.4_2', () => {
  expect(new FBS().eval('(map cadr \'((a b) (d e) (g h)))').toString()).toBe('(b e h)')
  expect(new FBS().eval('(map (lambda (n) (expt n n)) \'(1 2 3 4 5))').toString()).toBe('(1 4 27 256 3125)')
  expect(new FBS().eval('(map + \'(1 2 3) \'(4 5 6))').toString()).toBe('(5 7 9)')

  const code = `
  (let ((count 0))
  (map (lambda (ignored)
         (set! count (+ count 1))
         count)
       '(a b)))`
  expect(new FBS().eval(code).toString()).toBe('(1 2)') // order is unspecified. (2 1) is also OK.
})

test('✅6.4_3', () => {
  const code = `(let ((v (make-vector 5)))
  (for-each (lambda (i)
              (vector-set! v i (* i i)))
            '(0 1 2 3 4))
  v)`
  expect(new FBS().eval(code).toString()).toBe('#(0 1 4 9 16)')
})

test('✅6.4_4', () => {
  expect(new FBS().eval('(force (delay (+ 1 2)))').toString()).toBe('3')
  expect(new FBS().eval('(let ((p (delay (+ 1 2)))) (list (force p) (force p)))').toString()).toBe('(3 3)')
  const code = `
  (define a-stream
    (letrec ((next
              (lambda (n)
                (cons n (delay (next (+ n 1)))))))
      (next 0)))
  (define head car)
  (define tail
    (lambda (stream) (force (cdr stream))))

  (head (tail (tail a-stream)))`
  expect(new FBS().eval(code).toString()).toBe('2')
})

test('✅6.4_5', () => {
  const code = `(define count 0)
  (define p
    (delay (begin (set! count (+ count 1))
                  (if (> count x)
                      count
                      (force p)))))
  (define x 5)`
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('p') instanceof FsPromise).toBe(true)
  expect(fbs.eval('(force p)').toString()).toBe('6')
  expect(fbs.eval('p') instanceof FsPromise).toBe(true)
  expect(fbs.eval('(begin (set! x 10) (force p))').toString()).toBe('6')

  // possible implementation of (force and (delay are ignored.
  // (force and (delay are implemented in JS

  expect(fbs.eval('(eqv? (delay 1) 1)').toString()).toBe('#f') // unspecified
  expect(fbs.eval('(pair? (delay (cons 1 2)))').toString()).toBe('#f') // unspecified

  // (+ (delay (* 3 7)) 13) is error on gauche and mit-scheme, so ignore it.
})

test('6.4_6', () => {
  const code = `(call-with-current-continuation
    (lambda (exit)
      (for-each (lambda (x)
                  (if (negative? x)
                      (exit x)))
                '(54 0 37 -3 245 19))
      #t))`
  expect(new FBS().eval(code).toString()).toBe('-3')

  const code2 = `(define list-length
    (lambda (obj)
      (call-with-current-continuation
        (lambda (return)
          (letrec ((r
                    (lambda (obj)
                      (cond ((null? obj) 0)
                            ((pair? obj)
                             (+ (r (cdr obj)) 1))
                            (else (return #f))))))
            (r obj))))))`
  const fbs = new FBS()
  fbs.eval(code2)
  expect(fbs.eval('(list-length \'(1 2 3 4))').toString()).toBe('4')
  expect(fbs.eval('(list-length \'(a b . c))').toString()).toBe('#f')
})

// 6.5  Eval
// all cleared 😊
test('✅6.5', () => {
  expect(new FBS().eval('(eval \'(* 7 3) (scheme-report-environment 5))').toString()).toBe('21')
  const code = `(let ((f (eval '(lambda (f x) (f x x))
  (null-environment 5))))
  (f + 10))`
  expect(new FBS().eval(code).toString()).toBe('20')
})

// 6.6.3  Output
// (write obj, (write obj port -> port.test.js
// (display obj, (display obj port -> port.test.js
// (newline, (new line port -> port.test.js
// (write-char, (write-char port -> port.test.js

// 6.6.4  System interface
// (load -> proc.load.test.js
// optional procedure (transcript-on (transcript-off -> are not implemented at this time.
// gauche aand mit-scheme also not seem to implement them.
// gauche ... may use read-eval-print-loop http://practical-scheme.net/gauche/man/gauche-refj/eval-to-repl.html#index-read_002deval_002dprint_002dloop

// 7. Format Syntax and semantics

// Example
