import { create } from "zustand";

interface useOrderModalInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useOrderModal = create<useOrderModalInterface>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))