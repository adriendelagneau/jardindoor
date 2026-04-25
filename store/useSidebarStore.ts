// stores/sidebar-store.ts
import { create } from "zustand";

export type SidebarType = "home" | "admin" | "products";

export type SidebarState = {
  open: boolean;
  type: SidebarType;

  openSidebar: (type?: SidebarType) => void;
  closeSidebar: () => void;
  toggleSidebar: (type?: SidebarType) => void;
  setType: (type: SidebarType) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  open: false,
  type: "home",

  openSidebar: (type) =>
    set((state) => ({
      open: true,
      type: type || state.type,
    })),

  closeSidebar: () => set({ open: false }),

  toggleSidebar: (type) =>
    set((state) => ({
      open: !state.open,
      type: type || state.type,
    })),

  setType: (type) => set({ type }),
}));
