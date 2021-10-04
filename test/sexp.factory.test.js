import { FsNumber } from '../src/datatypes'
import { FsSymbol, SExpFactory } from '../src/sexp'

test('building number', () => {
  expect(SExpFactory.build('1')).toStrictEqual(new FsNumber(1))
  expect(SExpFactory.build('123abc')).toStrictEqual(new FsSymbol('123abc'))
})
