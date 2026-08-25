const RATIO = 150 / 71.4;

/** Site mark. `size` is height; width follows the shark's 150×71.4 viewBox. */
export function Mark({ size = 20, title }: { size?: number; title?: string }) {
  const height = size;
  const width = Math.round(size * RATIO);
  return (
    <img
      className="home-mark"
      src="/mark.svg"
      width={width}
      height={height}
      alt={title ?? ''}
      decoding="async"
      aria-hidden={title ? undefined : true}
    />
  );
}
