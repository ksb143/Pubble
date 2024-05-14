import { create } from 'zustand';

type RichStore = {
  currentUsers: { name: string; profileColor: string }[];
  setCurrentUsers: (
    currentUsers: { name: string; profileColor: string }[],
  ) => void;
};

const useRichStore = create<RichStore>((set) => ({
  currentUsers: [],
  setCurrentUsers: (currentUsers) => set({ currentUsers }),
}));

export default useRichStore;
