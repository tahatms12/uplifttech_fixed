import { PORTFOLIO } from './ids';
const CG = 'https://api.coingecko.com/api/v3';
const IDS = PORTFOLIO.map(c => c.id).join(',');
const KEY = 'cg:simple:v1';

export type Quote = {
  price: number; change24h: number; marketCap: number; volume24h: number; lastUpdated: number;
};
export type Quotes = Record<string, Quote>;

export async function fetchQuotes(): Promise<Quotes> {
  const url = `${CG}/simple/price?ids=${encodeURIComponent(IDS)}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('coingecko error');
  const json = await res.json();
  const now = Date.now();
  const out: Quotes = {};
  for (const [id, v] of Object.entries<any>(json)) {
    out[id] = {
      price: v.usd ?? 0,
      change24h: v.usd_24h_change ?? 0,
      marketCap: v.usd_market_cap ?? 0,
      volume24h: 0,
      lastUpdated: now,
    };
  }
  localStorage.setItem(KEY, JSON.stringify(out));
  return out;
}

export function loadCached(): Quotes | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
