import { expected, unexpected } from './error';
import type Lang from './lang';
import type { BinaryOperator, Token } from './lexer';

export type baseTypes = string | number | boolean;
export interface ExpressionBase {
  type: string;
  start: number;
  end: number;
  [key: string]: baseTypes | Expression | Array<baseTypes | Expression>;
}

export interface BinaryExpression extends ExpressionBase {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends ExpressionBase {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
}

export interface Identifier extends ExpressionBase {
  type: 'Identifier';
  name: string;
}

export interface Literal extends ExpressionBase {
  type: 'Literal';
  value: string;
}

export type Expression = BinaryExpression | UnaryExpression | Identifier | Literal;

export default class Builder {
  idx = 0;
  tokens: Token[];

  constructor(public lang: Lang) {}

  build(tokens: Token[]): Expression | undefined {
    this.tokens = tokens;
    this.idx = 0;
    const expr = this.gobbleExpression();
    if (this.idx !== this.tokens.length) throw unexpected(this.tokens[this.idx]);
    return expr;
  }

  next(): Token {
    return this.tokens[this.idx++];
  }

  gobbleGroup(): Expression | undefined {
    if (this.idx === this.tokens.length) return;
    const token = this.next();
    if (token.type === 'Identifier' || token.type === 'Literal') return token as Expression;
    else if (token.type === 'UnaryOperator') {
      const group = this.gobbleGroup();
      if (!group) throw expected(`expression after ${token.operator}`, token.end + 1);
      return {
        type: 'UnaryExpression',
        operator: token.operator,
        argument: group,
        start: token.start,
        end: group.end,
      };
    } else if (token.type === 'LParenthesis') {
      const expr = this.gobbleExpression();
      if (!expr) throw expected('expression', token.end + 1);
      if (this.idx === this.tokens.length || this.next().type !== 'RParenthesis')
        throw expected(')', expr?.end + 1);
      return expr;
    } else {
      throw unexpected(token);
    }
  }

  gobbleBinaryOp(): BinaryOperator | undefined {
    const token = this.tokens[this.idx];
    if (!token || token.type !== 'BinaryOperator') return;
    this.idx++;
    return token;
  }

  gobbleExpression(): Expression | undefined {
    let left = this.gobbleGroup();
    if (!left) return undefined;
    let op = this.gobbleBinaryOp();
    if (!op) return left;
    let right = this.gobbleGroup();
    if (!right) throw expected(`expression after ${op.operator}`, op.end + 1);

    const stack = [left, right];
    const stack_op = [op];

    while ((op = this.gobbleBinaryOp())) {
      while (
        stack_op.length > 0 &&
        this.lang.compareBinaryOperator(stack_op[stack_op.length - 1].operator, op.operator)
      ) {
        right = stack.pop()!;
        left = stack.pop()!;
        const last_op = stack_op.pop()!;
        stack.push({
          type: 'BinaryExpression',
          operator: last_op.operator,
          left,
          right,
          start: left.start,
          end: right.end,
        });
      }

      right = this.gobbleGroup();
      if (!right) throw expected(`expression after ${op.operator}`, op.end + 1);
      stack.push(right);
      stack_op.push(op);
    }

    while (stack_op.length > 0) {
      right = stack.pop()!;
      left = stack.pop()!;
      op = stack_op.pop()!;
      stack.push({
        type: 'BinaryExpression',
        operator: op.operator,
        left,
        right,
        start: left.start,
        end: right.end,
      });
    }

    return stack[0];
  }
}
