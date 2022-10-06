import Builder from './ast';
import Lexer from './lexer';
import type Lang from './lang';

export default class Parser {
  lexer: Lexer;
  builder: Builder;

  constructor(public lang: Lang) {
    this.lexer = new Lexer(lang);
    this.builder = new Builder(lang);
  }

  parse(expr: string) {
    const tokens = this.lexer.parse(expr);
    return this.builder.build(tokens);
  }
}
