"use client";

import { SearchIcon, MenuIcon, XIcon, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Suspense, useEffect, useState } from "react";

import { useSidebarStore } from "@/store/useSidebarStore";
import { signOut } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

import { NavSearchbar } from "./NavSearchbar";

export const NavbarAdmin = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebarStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

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

       

        {/* Actions */}
        <div className="hidden font-medium gap-6 text-lg lg:flex items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/favorites"
              className="flex items-center gap-1 underline-effect cursor-pointer text-sm"
            >
              Produits
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-1 underline-effect cursor-pointer text-sm"
            >
              Categories
            </Link>
            <Link
              href="/admin/brand"
              className="flex items-center gap-1 underline-effect cursor-pointer text-sm"
            >
              Marques
            </Link>
            <Link
              href="/images"
              className="flex items-center gap-1 underline-effect cursor-pointer text-sm"
            >
              Images
            </Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            <span className="hidden xl:inline">Déconnexion</span>
          </Button>
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
