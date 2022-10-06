import type { Expression } from './parser/ast';
import Lang from './parser/lang';
import Parser from './parser/parser';

const lang = new Lang(
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

function calcBinaryOp(op: string, left: boolean, right: boolean) {
  switch (op) {
    case '&':
    case '&&':
    case '∧':
      return left && right;
    case '|':
    case '||':
    case '∨':
      return left || right;
    case '>':
    case '->':
    case '→':
      return !left || right;
    case '<>':
    case '<->':
    case '↔':
    case '==':
      return (!left || right) && (left || !right);
    case '^':
    case '!=':
      return left !== right;
    case '↑':
      return !(left && right);
    case '↓':
      return !(left || right);
    default:
      return false;
  }
}

function findVariables(tree: Expression): Set<string> {
  const set = new Set<string>();
  switch (tree.type) {
    case 'Identifier':
      set.add(tree.name);
      break;
    case 'UnaryExpression':
      findVariables(tree.argument).forEach((value) => set.add(value));
      break;
    case 'BinaryExpression':
      findVariables(tree.left).forEach((value) => set.add(value));
      findVariables(tree.right).forEach((value) => set.add(value));
      break;
  }
  return set;
}

function calc(tree: Expression, values: Record<string, boolean>): boolean {
  switch (tree.type) {
    case 'Literal':
      return ['1', 'true', 'T'].includes(tree.value);
    case 'Identifier':
      return values[tree.name];
    case 'UnaryExpression':
      return !calc(tree.argument, values);
    case 'BinaryExpression':
      return calcBinaryOp(tree.operator, calc(tree.left, values), calc(tree.right, values));
  }
}

export interface ReturnType {
  variables: string[];
  results: boolean[][];
}

export default function process(exprs: string[]): ReturnType {
  const trees = exprs.map((subexpr) => parser.parse(subexpr)!);
  const variables = Array.from(new Set(...trees.map(findVariables)));
  variables.sort((a, b) => a.localeCompare(b));
  const results: boolean[][] = [];
  for (let i = 0; i < 1 << variables.length; i += 1) {
    const values = variables.reduce<Record<string, boolean>>((values, value, idx) => {
      values[value] = !!(i & (1 << (variables.length - idx - 1)));
      return values;
    }, {});
    results.push(trees.map((tree) => calc(tree, values)));
  }

  return {
    variables,
    results,
  };
}
