import { FsInteger } from '../src/datatypes'
import { SExpFactory } from '../src/parser'
import { FsSymbol } from '../src/symbol'

test('building number', () => {
  expect(SExpFactory.build('1')).toStrictEqual(new FsInteger(1))
  expect(SExpFactory.build('123abc')).toStrictEqual(new FsSymbol('123abc'))
})
