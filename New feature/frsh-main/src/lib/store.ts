import { create } from 'zustand';
import type { Quotes } from './coingecko';

interface S {
  quotes: Quotes; lastSync: number; syncing: boolean;
  setQuotes: (q: Quotes) => void; setSyncing: (b: boolean) => void;
}
export const useStore = create<S>(set => ({
  quotes: {}, lastSync: 0, syncing: false,
  setQuotes: q => set({ quotes: q, lastSync: Date.now() }),
  setSyncing: b => set({ syncing: b }),
}));
