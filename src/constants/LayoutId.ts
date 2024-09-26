/** A layout id for animation. */
export type LayoutId = `display:${string}`;

export function displayLayoutId(username: string): LayoutId {
  return `display:${username}`;
}
