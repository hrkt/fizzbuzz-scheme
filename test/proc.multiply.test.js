'use strict'

import { FsComplex, FsInteger, FsRational, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (* 1) yields 1', () => {
  const code = '(* 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (* 1 3) yields 3', () => {
  const code = '(* 1 3)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(3))
})

test('evaluating (* 3 2 1) yields 6', () => {
  const code = '(* 3 2 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(6))
})

test('evaluating (* 3 0 1) yields 0', () => {
  const code = '(* 3 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(0))
})

// binary

test('evaluating (* 1 2) yields 2', () => {
  expect(new FBS().eval('(* 1 2)')).toStrictEqual(new FsInteger(2))
})

test('evaluating (* 1 3/2) yields 5/2', () => {
  expect(new FBS().eval('(* 1 3/2)')).toStrictEqual(new FsRational(5, 2))
})

test('evaluating (* 1 1.0) yields 1.0', () => {
  expect(new FBS().eval('(* 1 1.0)')).toStrictEqual(new FsReal(1.0))
})

test('evaluating (* 1 1+1i) yields 1+1i', () => {
  expect(new FBS().eval('(+ 1 1+1i)')).toStrictEqual(new FsComplex(1, 1))
})

// multiple

test('evaluating (* 1 2.0 3) yields 6.0', () => {
  expect(new FBS().eval('(* 1 2.0 3)')).toStrictEqual(new FsReal(6.0))
})

test('evaluating (* 1 2.5 3/2) yields 3.75', () => {
  expect(new FBS().eval('(* 1 2.5 3/2)')).toStrictEqual(new FsReal(3.75))
})

test('evaluating (* 1 2.5 3/2 1+1i) yields 3.75+3.75i', () => {
  expect(new FBS().eval('(* 1 2.5 3/2 1+1i)')).toStrictEqual(new FsComplex(3.75, 3.75))
})
