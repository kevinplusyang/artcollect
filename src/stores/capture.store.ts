import { create } from "zustand";

interface CapturedPhoto {
  uri: string;
  width: number;
  height: number;
}

interface CaptureState {
  portfolioId: string | null;
  artworkPhotos: CapturedPhoto[];
  labelPhoto: CapturedPhoto | null;

  setPortfolioId: (id: string) => void;
  addArtworkPhoto: (photo: CapturedPhoto) => void;
  removeArtworkPhoto: (index: number) => void;
  setLabelPhoto: (photo: CapturedPhoto | null) => void;
  reset: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  portfolioId: null,
  artworkPhotos: [],
  labelPhoto: null,

  setPortfolioId: (id) => set({ portfolioId: id }),
  addArtworkPhoto: (photo) =>
    set((state) => ({ artworkPhotos: [...state.artworkPhotos, photo] })),
  removeArtworkPhoto: (index) =>
    set((state) => ({
      artworkPhotos: state.artworkPhotos.filter((_, i) => i !== index),
    })),
  setLabelPhoto: (photo) => set({ labelPhoto: photo }),
  reset: () =>
    set({ portfolioId: null, artworkPhotos: [], labelPhoto: null }),
}));
