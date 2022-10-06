import type { Token } from './lexer';

export type ParseErrorType = 'unexpected' | 'expected' | 'custom';

export class ParseError extends Error {
  constructor(
    public type: ParseErrorType,
    public body: string,
    public start: number,
    public end: number
  ) {
    super(`${body} at character ${start === end ? start : `${start}-${end}`}`);
  }
}

function stringify(token: Token) {
  switch (token.type) {
    case 'LParenthesis':
      return '(';
    case 'RParenthesis':
      return ')';
    case 'BinaryOperator':
    case 'UnaryOperator':
      return token.operator;
    case 'Identifier':
      return token.name;
    case 'Literal':
      return token.value;
  }
}

export function unexpected(what: Token): ParseError;
export function unexpected(what: string, start: number, end?: number): ParseError;
export function unexpected(what: string | Token, start?: number, end?: number) {
  if (typeof what !== 'string') {
    start = what.start;
    what = stringify(what);
  }
  return new ParseError('unexpected', `Unexpected ${what}`, start, end ?? start);
}

export function expected(what: string, start: number, end?: number) {
  return new ParseError('expected', `Expected ${what}`, start, end ?? start);
}

export function custom(what: string, start: number, end?: number) {
  return new ParseError('custom', what, start, end ?? start);
}
