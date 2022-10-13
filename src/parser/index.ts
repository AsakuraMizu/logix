import Lang from './lang';
import Parser from './parser';

export const lang = new Lang(
  {
    '&': [4, false],
    '&&': [4, false],
    '∧': [4, false],
    '|': [3, false],
    '||': [3, false],
    '∨': [3, false],
    '>': [2, true],
    '->': [2, true],
    '→': [2, true],
    '<>': [1, true],
    '<->': [1, true],
    '↔': [1, true],
    '==': [1, true],
    '^': [5, false],
    '!=': [5, false],
    '↑': [4, false],
    '↓': [3, false],
  },
  ['!', '~', '¬'],
  ['0', '1', 'false', 'true', 'F', 'T'],
  '#_@'
);

const parser = new Parser(lang);
export default parser;

export * from './ast';
export * from './error';
export * from './lang';
export * from './lexer';
export * from './parser';
