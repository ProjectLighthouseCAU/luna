export interface Vec3<T> {
  x: T;
  y: T;
  z: T;
}

export function add(lhs: Vec3<number>, rhs: Vec3<number>): Vec3<number> {
  return {
    x: lhs.x + rhs.x,
    y: lhs.y + rhs.y,
    z: lhs.z + rhs.z,
  };
}

export function sub(lhs: Vec3<number>, rhs: Vec3<number>): Vec3<number> {
  return {
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y,
    z: lhs.z - rhs.z,
  };
}

export function scale(lhs: Vec3<number>, rhs: number): Vec3<number> {
  return {
    x: lhs.x * rhs,
    y: lhs.y * rhs,
    z: lhs.z * rhs,
  };
}

export function length(operand: Vec3<number>): number {
  return Math.sqrt(
    operand.x * operand.x + operand.y * operand.y + operand.z * operand.z
  );
}

export function dist(lhs: Vec3<number>, rhs: Vec3<number>): number {
  return length(sub(lhs, rhs));
}

export function areEqual(lhs: Vec3<number>, rhs: Vec3<number>): boolean {
  return lhs.x === rhs.x && lhs.y === rhs.y && lhs.z === rhs.z;
}

export function isInstance(value: any): value is Vec3<unknown> {
  return 'x' in value && 'y' in value && 'z' in value;
}
