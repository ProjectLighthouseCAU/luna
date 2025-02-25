export interface Vec2<T> {
  x: T;
  y: T;
}

export function vec2Add(lhs: Vec2<number>, rhs: Vec2<number>): Vec2<number> {
  return {
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y,
  };
}

export function vec2Sub(lhs: Vec2<number>, rhs: Vec2<number>): Vec2<number> {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y,
  };
}

export function vec2Scale(lhs: Vec2<number>, rhs: number): Vec2<number> {
  return {
    x: lhs.x * rhs,
    y: lhs.y * rhs,
  };
}

export function vec2Length(operand: Vec2<number>): number {
  return Math.sqrt(operand.x * operand.x + operand.y * operand.y);
}

export function vec2Dist(lhs: Vec2<number>, rhs: Vec2<number>): number {
  return vec2Length(vec2Sub(lhs, rhs));
}

export function vec2Equal(lhs: Vec2<number>, rhs: Vec2<number>): boolean {
  return lhs.x === rhs.x && lhs.y === rhs.y;
}
