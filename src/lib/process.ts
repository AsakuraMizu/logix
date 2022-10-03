import jsep, {
  type BinaryExpression,
  type CoreExpression,
  type Identifier,
  type Literal,
  type UnaryExpression,
} from 'jsep';

export function init() {
  ['-', '+'].forEach((op) => jsep.removeUnaryOp(op));
  Object.keys(jsep.binary_ops).forEach((op) => jsep.removeBinaryOp(op));

  jsep.addUnaryOp('¬');

  jsep.addBinaryOp('&', 5);
  jsep.addBinaryOp('&&', 5);
  jsep.addBinaryOp('∧', 5);

  jsep.addBinaryOp('|', 3);
  jsep.addBinaryOp('||', 3);
  jsep.addBinaryOp('∨', 3);

  jsep.addBinaryOp('>', 2, true);
  jsep.addBinaryOp('->', 2, true);
  jsep.addBinaryOp('→', 2, true);

  jsep.addBinaryOp('<>', 1);
  jsep.addBinaryOp('<->', 1);
  jsep.addBinaryOp('↔', 1);
  jsep.addBinaryOp('==', 1);
  jsep.addBinaryOp('===', 1);

  jsep.addBinaryOp('^', 4);
  jsep.addBinaryOp('!=', 4);
  jsep.addBinaryOp('!==', 4);

  jsep.addBinaryOp('↑', 5);

  jsep.addBinaryOp('↓', 3);
}

function ban(type: string, set = '') {
  throw Error(`${type} not allowed${set && ` (remove possible ${set})`}`);
}

function check(tree: CoreExpression): LimitedExpression {
  if (tree.type === 'Compound') ban(tree.type, ',;');
  if (tree.type === 'MemberExpression') ban(tree.type, '.[]');
  if (tree.type === 'ThisExpression') ban(tree.type, 'this');
  if (tree.type === 'CallExpression') ban(tree.type);
  if (tree.type === 'ConditionalExpression') ban(tree.type, '?:');
  if (tree.type === 'ArrayExpression') ban(tree.type, '[]');
  if (
    tree.type === 'Literal' &&
    (tree.value === null ||
      tree.value instanceof RegExp ||
      typeof tree.value === 'string' ||
      (typeof tree.value === 'number' && tree.value !== 0 && tree.value !== 1))
  )
    ban(tree.raw);
  if (tree.type === 'UnaryExpression') check(tree.argument as CoreExpression);
  if (tree.type === 'BinaryExpression')
    check(tree.left as CoreExpression), check(tree.right as CoreExpression);
  return tree as LimitedExpression;
}

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
    case '===':
      return (!left || right) && (left || !right);
    case '^':
    case '!=':
    case '!==':
      return left !== right;
    case '↑':
      return !(left && right);
    case '↓':
      return !(left || right);
  }
}

type LimitedExpression = Identifier | Literal | UnaryExpression | BinaryExpression;

function findVariables(tree: LimitedExpression): Set<string> {
  const set = new Set<string>();
  switch (tree.type) {
    case 'Identifier':
      set.add(tree.name);
      break;
    case 'UnaryExpression':
      findVariables(tree.argument as LimitedExpression).forEach((value) => set.add(value));
      break;
    case 'BinaryExpression':
      findVariables(tree.left as LimitedExpression).forEach((value) => set.add(value));
      findVariables(tree.right as LimitedExpression).forEach((value) => set.add(value));
      break;
  }
  return set;
}

function calc(tree: LimitedExpression, values: Record<string, boolean>): boolean {
  switch (tree.type) {
    case 'Literal':
      return !!tree.value;
    case 'Identifier':
      return values[tree.name];
    case 'UnaryExpression':
      return !calc(tree.argument as LimitedExpression, values);
    case 'BinaryExpression':
      return calcBinaryOp(
        tree.operator,
        calc(tree.left as LimitedExpression, values),
        calc(tree.right as LimitedExpression, values)
      );
  }
}

export interface ReturnType {
  variables: string[];
  result: boolean[];
}

export function process(expr: string): ReturnType {
  let tree = jsep(expr) as CoreExpression;
  tree = check(tree);
  const variables = Array.from(findVariables(tree));
  variables.sort((a, b) => a.localeCompare(b));
  const result: boolean[] = [];
  for (let i = 0; i < 1 << variables.length; i += 1) {
    const values = variables.reduce<Record<string, boolean>>((values, value, idx) => {
      values[value] = !!(i & (1 << (variables.length - idx - 1)));
      return values;
    }, {});
    result.push(calc(tree, values));
  }

  return {
    variables,
    result,
  };
}
