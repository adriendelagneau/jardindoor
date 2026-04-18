"use client";

import { PackageIcon, SproutIcon, TagIcon, ImageIcon, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminContent = () => {
  return (
    <div>
      <ul className="flex flex-col items-start gap-2">
        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </li>

        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <PackageIcon className="mr-2 h-4 w-4" />
            Produits
          </Button>
        </li>
        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <SproutIcon className="mr-2 h-4 w-4" />
            Graines
          </Button>
        </li>
        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <TagIcon className="mr-2 h-4 w-4" />
            Marques
          </Button>
        </li>
        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <ImageIcon className="mr-2 h-4 w-4" />
            Images
          </Button>
        </li>
      </ul>
      <Separator className="my-4" />
    </div>
  );
};

export default AdminContent;
