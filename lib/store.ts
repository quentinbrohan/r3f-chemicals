import { create } from "zustand";

export type HormoneNames = 'DOPAMINE' | 'OXYTOCIN' | 'SEROTONIN'

type Store = {
  isLoaderLoaded: boolean;
  setIsLoaderLoaded: (value: boolean) => void;
  hoveredName: HormoneNames | null;
  setHoveredName: (value: HormoneNames | null) => void;
};

export const useStore = create<Store>((set) => ({
  isLoaderLoaded: false,
  setIsLoaderLoaded: (value) =>
    set({
      isLoaderLoaded: value,
    }),
  hoveredName: null,
  setHoveredName: (value) =>
    set({
      hoveredName: value,
    }),
}));
