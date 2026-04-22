"use client";

import { SearchIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Suspense, useEffect, useState } from "react";

import { useSidebarStore } from "@/store/useSidebarStore";

import { NavSearchbar } from "./NavSearchbar";

export const NavbarAdmin = () => {
  const { toggleSidebar } = useSidebarStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center border-b px-4 shadow-sm lg:px-8">
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center lg:justify-between">
        {/* Mobile menu */}
        <button onClick={() => toggleSidebar("admin")} className="lg:hidden">
          <MenuIcon size={24} />
        </button>

        {/* Logo */}
        <Link
          href="/admin"
          className="absolute top-1/2 left-1/2 flex items-center -translate-x-1/2 -translate-y-1/2 gap-2 lg:static lg:translate-x-0 lg:translate-y-0"
        >
          <Image
            src="/logo1.png"
            alt="Lokko logo"
            width={50}
            height={50}
            sizes="50px"
            className=""
          />
          <div className="font-bold uppercase">jardin indoor</div>
        </Link>

        {/* Search */}
        <div className="relative  hidden grow lg:flex justify-center">
          <Suspense fallback={null}>
            <NavSearchbar />
          </Suspense>
        </div>

        {/* Actions */}
        <div className="hidden font-medium gap-4 text-lg lg:flex items-center">
          <Link
            href="/favorites"
            className="flex items-center gap-1 underline-effect cursor-pointer"
          >
            Produits
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-1 underline-effect cursor-pointer"
          >
            Graines
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-1 underline-effect cursor-pointer"
          >
            Marques
          </Link>
          <Link
            href="/images"
            className="flex items-center gap-1 underline-effect cursor-pointer"
          >
            Images
          </Link>
        </div>
      </div>
      <SearchIcon
        size={20}
        className="ml-2 cursor-pointer lg:hidden"
        onClick={() => setIsSearchOpen(true)}
      />
      <div
        className={`bg-background absolute inset-x-0 top-0 z-50 flex h-full items-center px-4 transition-transform duration-300 ease-in-out lg:hidden ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full">
          <Suspense fallback={null}>
            <NavSearchbar />
          </Suspense>
        </div>
        <button
          onClick={() => setIsSearchOpen(false)}
          className="ml-2"
          aria-label="Fermer la recherche"
        >
          <XIcon size={24} />
        </button>
      </div>
    </div>
  );
};
