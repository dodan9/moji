import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface TMapStore {
  currentLocation: [number, number];
  setCurrentLocation: (menu: [number, number]) => void;
}

export const useMapStore = create<TMapStore>()(
  persist(
    immer((set) => ({
      currentLocation: [37.5665, 126.978],
      setCurrentLocation: (location) =>
        set(() => ({ currentLocation: location })),
    })),
    {
      name: "moji",
      partialize: (state) => ({ currentLocation: state.currentLocation }),
    }
  )
);

export const useCurrentLocation = () =>
  useMapStore((state) => state.currentLocation);
