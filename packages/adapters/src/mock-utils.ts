export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

export function seededFloat(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const t = x - Math.floor(x);
  return min + t * (max - min);
}

export function seededInt(seed: number, min: number, max: number): number {
  return Math.floor(seededFloat(seed, min, max));
}
