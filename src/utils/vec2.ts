export interface Vec2<T> {
  x: T;
  y: T;
}

export function add(lhs: Vec2<number>, rhs: Vec2<number>): Vec2<number> {
  return {
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y,
  };
}

export function sub(lhs: Vec2<number>, rhs: Vec2<number>): Vec2<number> {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y,
  };
}

export function scale(lhs: Vec2<number>, rhs: number): Vec2<number> {
  return {
    x: lhs.x * rhs,
    y: lhs.y * rhs,
  };
}

export function length(operand: Vec2<number>): number {
  return Math.sqrt(operand.x * operand.x + operand.y * operand.y);
}

export function dist(lhs: Vec2<number>, rhs: Vec2<number>): number {
  return length(sub(lhs, rhs));
}

export function areEqual(lhs: Vec2<number>, rhs: Vec2<number>): boolean {
  return lhs.x === rhs.x && lhs.y === rhs.y;
}
