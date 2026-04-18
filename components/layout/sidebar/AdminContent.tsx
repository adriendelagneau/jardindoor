"use client";

import { PackageIcon, SproutIcon, TagIcon, ImageIcon, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSidebarStore } from "@/store/useSidebarStore";

const AdminContent = () => {
  const { closeSidebar } = useSidebarStore();

  return (
    <div>
      <ul className="flex flex-col items-start gap-2">
        <li className="w-full">
          <Link href="/admin" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </li>

        <li className="w-full">
          <Link href="/admin/products" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <PackageIcon className="mr-2 h-4 w-4" />
              Produits
            </Button>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/admin/seeds" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <SproutIcon className="mr-2 h-4 w-4" />
              Graines
            </Button>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/admin/brands" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <TagIcon className="mr-2 h-4 w-4" />
               Marques
            </Button>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/admin/images" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <ImageIcon className="mr-2 h-4 w-4" />
              Images
            </Button>
          </Link>
        </li>
      </ul>
      <Separator className="my-4" />
    </div>
  );
};

export default AdminContent;
