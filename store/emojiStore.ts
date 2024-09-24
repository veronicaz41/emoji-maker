import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EmojiData } from '@/components/EmojiGrid';

interface EmojiStore {
  emojis: EmojiData[];
  setEmojis: (emojis: EmojiData[]) => void;
  updateEmoji: (index: number, updates: Partial<EmojiData>) => void;
}

const storage = {
  getItem: (name: string) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(name);
    }
  },
};

export const useEmojiStore = create<EmojiStore>()(
  persist(
    (set) => ({
      emojis: [],
      setEmojis: (emojis) => set({ emojis }),
      updateEmoji: (index, updates) =>
        set((state) => ({
          emojis: state.emojis.map((emoji, i) =>
            i === index ? { ...emoji, ...updates } : emoji
          ),
        })),
    }),
    {
      name: 'emoji-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);