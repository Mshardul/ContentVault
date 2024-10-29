export const darkenColor = (color = '#3490dc', amount = 10) => {
  if (!color.startsWith('#')) {
    return color; // Return as-is if not hex format
  }

  let colorVal = color.slice(1); // Remove #
  let r = parseInt(colorVal.substring(0, 2), 16);
  let g = parseInt(colorVal.substring(2, 4), 16);
  let b = parseInt(colorVal.substring(4, 6), 16);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
