'use strict'

import { FsBoolean, FsComplex, FsInteger, FsList, FsNumber, FsPair, FsRational, FsReal, FsString, isProperList } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('null is not a proper list', () => {
  expect(isProperList(null)).toBe(false)
})

test('FsList is a proper list', () => {
  expect(isProperList(new FsList([]))).toBe(true)
})

test('(1 . 2) is not a proper list', () => {
  const p = new FsPair(new FsNumber(1), new FsNumber(2))
  expect(isProperList(p)).toBe(false)
})

test('(1 . ()) is  a proper list', () => {
  const p = new FsPair(new FsNumber(1), FsList.EMPTY)
  expect(isProperList(p)).toBe(true)
})

test('FsString is not a proper list', () => {
  expect(isProperList(new FsString(''))).toBe(false)
})

// numeric

test('FsInteger.isStrRep ', () => {
  const intReps = ['0', '1', '123456', '-1']
  intReps.forEach(r => {
    expect(FsInteger.isStringRep(r)).toBe(true)
  })
})

test('FsRational.isStrRep ', () => {
  expect(FsRational.isStringRep('1/2')).toBe(true)
  expect(FsRational.isStringRep('-3/4')).toBe(true)
})

test('FsReal.isStrRep ', () => {
  expect(FsReal.isStringRep('0.1')).toBe(true)
  expect(FsReal.isStringRep('-1.2')).toBe(true)
  expect(FsReal.isStringRep('1')).toBe(true)
  expect(FsReal.isStringRep('0')).toBe(true)
})

test('FsComplex.isStrRep ', () => {
  expect(FsComplex.isStringRep('1+2i')).toBe(true)
  expect(FsComplex.isStringRep('-3-4i')).toBe(true)
  expect(FsComplex.isStringRep('0+0i')).toBe(true)
})

test('evaluating (integer? 123) yields #t', () => {
  expect(new FBS().eval('(integer? 123)')).toStrictEqual(FsBoolean.TRUE)
})

// Rational

test('rational number equality', () => {
  expect(new FsRational(1, 3).equals(new FsRational(3, 9))).toBe(true)
})

test('rational number less than', () => {
  expect(new FsRational(1, 3).lessThan(new FsRational(2, 3))).toBe(true)
})

test('rational number greater than', () => {
  expect(new FsRational(2, 3).greaterThan(new FsRational(1, 3))).toBe(true)
})

test('rational number add', () => {
  expect(new FsRational(1, 3).add(new FsRational(1, 3))).toStrictEqual(new FsRational(2, 3))
})

test('rational number subtract', () => {
  expect(new FsRational(2, 3).subtract(new FsRational(1, 3))).toStrictEqual(new FsRational(1, 3))
})

test('rational number multiply', () => {
  expect(new FsRational(2, 3).subtract(new FsRational(1, 3))).toStrictEqual(new FsRational(2, 9))
})

test('rational number additiveInverse', () => {
  expect(new FsRational(1, 3).additiveInverse()).toStrictEqual(new FsRational(-1, 3))
})

test('rational number multiplicativeInverse', () => {
  expect(new FsRational(2, 3).additiveInverse()).toStrictEqual(new FsRational(3, 2))
})

test('rational number devide', () => {
  expect(new FsRational(1, 3).devide(new FsRational(1, 2))).toStrictEqual(new FsRational(3, 2))
})

test('rational number power', () => {
  expect(new FsRational(1, 3).integerPower(3)).toStrictEqual(new FsRational(1, 27))
  expect(new FsRational(1, 3).integerPower(0)).toStrictEqual(new FsInteger(1))
  expect(new FsRational(1, 3).integerPower(-3)).toStrictEqual(new FsInteger(27))
})

test('rational number asReal', () => {
  expect(new FsRational(1, 2).asReal()).toStrictEqual(new FsReal(0.5))
  expect(new FsRational(1, 3).asReal()).toStrictEqual(new FsReal(0.3333333333333333))
})
