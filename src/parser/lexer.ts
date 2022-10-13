import { unexpected } from './error';
import type Lang from './lang';

export interface IToken {
  type: string;
  start: number;
  end: number;
  [key: string]: string | number | boolean;
}

export interface BinaryOperator extends IToken {
  type: 'BinaryOperator';
  operator: string;
}

export interface UnaryOperator extends IToken {
  type: 'UnaryOperator';
  operator: string;
}

export interface LParenthesis extends IToken {
  type: 'LParenthesis';
}

export interface RParenthesis extends IToken {
  type: 'RParenthesis';
}

export interface IdentifierToken extends IToken {
  type: 'Identifier';
  name: string;
}

export interface LiteralToken extends IToken {
  type: 'Literal';
  value: string;
}

export type Token =
  | BinaryOperator
  | UnaryOperator
  | LParenthesis
  | RParenthesis
  | IdentifierToken
  | LiteralToken;

export default class Lexer {
  idx = 0;

  constructor(private lang: Lang) {}

  parse(expr: string): Token[] {
    this.idx = 0;
    const result: Token[] = [];
    let maybe_unary = true;
    while (this.idx < expr.length) {
      const char = expr[this.idx];
      if (char === ' ' || char === '\t') {
        this.idx++;
        continue;
      } else if (char === '(') {
        result.push({ type: 'LParenthesis', start: this.idx, end: this.idx });
        maybe_unary = true;
        this.idx++;
      } else if (char === ')') {
        result.push({ type: 'RParenthesis', start: this.idx, end: this.idx });
        maybe_unary = false;
        this.idx++;
      } else {
        let match: string | undefined;
        if (maybe_unary && (match = this.matchUnaryOperator(expr))) {
          result.push({
            type: 'UnaryOperator',
            start: this.idx,
            end: this.idx + match.length - 1,
            operator: match,
          });
          this.idx += match.length;
          maybe_unary = true;
        } else if ((match = this.matchBinaryOperator(expr))) {
          result.push({
            type: 'BinaryOperator',
            start: this.idx,
            end: this.idx + match.length - 1,
            operator: match,
          });
          this.idx += match.length;
          maybe_unary = true;
        } else if ((match = this.matchLiteral(expr))) {
          result.push({
            type: 'Literal',
            start: this.idx,
            end: this.idx + match.length - 1,
            value: match,
          });
          this.idx += match.length;
          maybe_unary = false;
        } else if (this.lang.identifierStart(char)) {
          let name = '';
          const start = this.idx;
          do {
            name += expr[this.idx];
            this.idx++;
          } while (this.idx < expr.length && this.lang.identifierBody(expr[this.idx]));
          result.push({ type: 'Identifier', start, end: this.idx - 1, name });
          maybe_unary = false;
        } else {
          throw unexpected(char, this.idx);
        }
      }
    }
    return result;
  }

  matchBinaryOperator(expr: string) {
    return this.lang.matchBinaryOperator(expr.slice(this.idx, this.idx + this.lang.binary_max_len));
  }

  matchUnaryOperator(expr: string) {
    return this.lang.matchUnaryOperator(expr.slice(this.idx, this.idx + this.lang.unary_max_len));
  }

  matchLiteral(expr: string) {
    return this.lang.matchLiteral(expr.slice(this.idx, this.idx + this.lang.literal_max_len));
  }
}
