export function classes(...classNames: (string | boolean)[]): string {
  return classNames.filter(Boolean).join(" ");
}

export const pointInRectangle = (
  x: number,
  y: number,
  rect: { x: number; y: number; width: number; height: number },
): boolean => {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
};

export const pointInEllipse = (
  x: number,
  y: number,
  ellipse: { x: number; y: number; radiusX: number; radiusY: number },
): boolean => {
  const dx = x - ellipse.x;
  const dy = y - ellipse.y;
  const a = ellipse.radiusX;
  const b = ellipse.radiusY;
  return (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1;
};
