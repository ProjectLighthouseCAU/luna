export interface TimeIntervalProps {
  seconds: number;
  layout?: 'horizontal' | 'vertical';
}

export function TimeInterval({
  seconds: rawSeconds,
  layout = 'horizontal',
}: TimeIntervalProps) {
  const seconds = Math.floor(rawSeconds);
  const components: string[] = [`${seconds % 60} s`];
  if (seconds > 60) {
    const minutes = Math.floor(seconds / 60);
    components.push(`${minutes % 60} m`);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      components.push(`${hours % 24} h`);
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        components.push(`${days} d`);
      }
    }
  }
  components.reverse();
  return (
    <div
      className={`flex ${layout === 'horizontal' ? 'flex-row gap-1' : 'items-start flex-col'}`}
    >
      {components.map((c, i) => (
        <div key={c.split(' ').at(-1)}>
          {c}
          {i !== components.length - 1 ? ',' : undefined}
        </div>
      ))}
    </div>
  );
}
