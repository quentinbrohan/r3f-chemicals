import { create } from "zustand";


export const HORMONE_NAMES = {
  DOPAMINE: "DOPAMINE",
  OXYTOCIN: "OXYTOCIN",
  SEROTONIN: "SEROTONIN",
} as const;

export type HormoneNames = keyof typeof HORMONE_NAMES;

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
