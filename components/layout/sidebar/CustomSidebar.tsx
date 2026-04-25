"use client";

import { ReactNode, useEffect } from "react";


// components/custom-sidebar.tsx

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  width?: string;
  children: ReactNode;
};

export function CustomSidebar({
  open,
  onClose,
  side = "left",
  width = "w-80",
  children,
}: Props) {


  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ------------------------------------------------------------
     Auto-close on desktop (lg+)
  ------------------------------------------------------------ */
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      if (media.matches ) {
        onClose();
      }
    };

    media.addEventListener("change", handleChange);
    handleChange(); // run once on mount

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} z-[100] h-screen ${width} bg-background shadow-xl transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        {children}
      </aside>
    </>
  );
}
