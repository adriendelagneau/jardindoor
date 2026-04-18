"use client";

import { XIcon } from "lucide-react";

import { CustomSidebar } from "./CustomSidebar";
import HomeContent from "./HomeContent";
import AdminContent from "./AdminContent";
import { useSidebarStore } from "@/store/useSidebarStore";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar() {
  const { open, closeSidebar, type } = useSidebarStore();

  return (
    <CustomSidebar open={open} onClose={closeSidebar} side="left">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b p-4">
                {/* Logo */}
        <Link
          href={type === "admin" ? "/admin" : "/"}
          className="relative flex items-center gap-2"
        >
          <div className="relative h-[50px] w-[50px]">
            <Image
              src="/logo1.png"
              alt="Lokko logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="font-bold uppercase">jardin indoor {type === "admin" && "(Admin)"}</div>
        </Link>
          <button onClick={closeSidebar} aria-label="Close sidebar">
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {type === "admin" ? <AdminContent /> : <HomeContent />}
        </div>
      </div>
    </CustomSidebar>
  );
}
