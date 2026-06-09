// Session-only flash deals — 3 random products, 30-min window, 20% off
// No persistence; resets when the tab closes

let SESSION_FLASHES: { id: string; endMs: number } [] = [];

export const FLASH_DISCOUNT = 0.20;

export function initFlashes(productIds: string[]): void {
  if (SESSION_FLASHES.length > 0) return; // already set for this session
  const endMs = Date.now() + 30 * 60 * 1000;
  const shuffled = [...productIds].sort(() => Math.random() - 0.5);
  SESSION_FLASHES = shuffled.slice(0, 3).map((id) => ({ id, endMs }));
}

export function getFlashForProduct(productId: string): { active: boolean; endMs: number } | null {
  const f = SESSION_FLASHES.find((x) => x.id === productId);
  if (!f) return null;
  return { active: Date.now() < f.endMs, endMs: f.endMs };
}

export function getAllFlashes() {
  return SESSION_FLASHES;
}
