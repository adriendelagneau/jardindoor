"use client";

import { AppWindowIcon, BellRingIcon, MailIcon, StoreIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useSidebarStore } from "@/store/useSidebarStore";

import { useRouter } from "next/navigation";

const HomeContent = () => {
  return (
    <div>
      <ul className="flex flex-col items-start gap-2">
        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <AppWindowIcon className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </li>

        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <StoreIcon className="mr-2 h-4 w-4" />
            Boutique
          </Button>
        </li>

        <li className="w-full">
          <Button variant="ghost" className="w-full justify-start text-left">
            <MailIcon className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </li>
      </ul>
      <Separator className="my-4" />
    </div>
  );
};

export default HomeContent;
