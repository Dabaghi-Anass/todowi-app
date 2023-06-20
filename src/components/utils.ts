export function hexToHsl(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const L = (max + min) / 2;

  const S =
    max === min
      ? 0
      : L > 0.5
      ? (max - min) / (2 - max - min)
      : (max - min) / (max + min);
  let H = 0;
  if (max !== min) {
    switch (max) {
      case r:
        H = (g - b) / (max - min);
        break;
      case g:
        H = 2 + (b - r) / (max - min);
        break;
      case b:
        H = 4 + (r - g) / (max - min);
        break;
    }
  }
  H *= 60;
  if (H < 0) {
    H += 360;
  }
  return { H, S, L };
}
export function rgbToHex(color: string) {
  color = color.replace("rgb(", "").replace(")", "");
  let [rs, gs, bs] = color.split(",");
  let r = +rs.trim();
  let g = +gs.trim();
  let b = +bs.trim();
  let red = r.toString(16).padStart(2, "0");
  let green = g.toString(16).padStart(2, "0");
  let blue = b.toString(16).padStart(2, "0");
  return "#" + red + green + blue;
}
