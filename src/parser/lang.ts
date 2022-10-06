export default class Lang {
  constructor(
    private binary_operators: Record<string, [number, boolean]>,
    private unary_operators: string[],
    private literals: string[],
    private additonalChar: string
  ) {
    this.binary_max_len = Math.max(...Object.keys(binary_operators).map((op) => op.length));
    this.unary_max_len = Math.max(...unary_operators.map((op) => op.length));
    this.literal_max_len = Math.max(...literals.map((str) => str.length));
  }

  binary_max_len: number;
  unary_max_len: number;
  literal_max_len: number;

  matchBinaryOperator(expr: string): string | undefined {
    let len = this.binary_max_len;
    while (len > 0) {
      if (this.binary_operators[expr.slice(0, len)]) return expr.slice(0, len);
      len--;
    }
    return;
  }

  matchUnaryOperator(expr: string): string | undefined {
    let len = this.unary_max_len;
    while (len > 0) {
      if (this.unary_operators.includes(expr.slice(0, len))) return expr.slice(0, len);
      len--;
    }
    return;
  }

  matchLiteral(expr: string): string | undefined {
    let len = this.literal_max_len;
    while (len > 0) {
      if (this.literals.includes(expr.slice(0, len))) return expr.slice(0, len);
      len--;
    }
    return;
  }

  identifierStart(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || this.additonalChar.includes(c);
  }

  identifierBody(c: string): boolean {
    return (
      (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      (c >= '0' && c <= '9') ||
      this.additonalChar.includes(c)
    );
  }

  compareBinaryOperator(op1: string, op2: string): boolean {
    const o1 = this.binary_operators[op1],
      o2 = this.binary_operators[op2];
    return o1[1] && o2[1] ? o1[0] > o2[0] : o1[0] >= o2[0];
  }
}
