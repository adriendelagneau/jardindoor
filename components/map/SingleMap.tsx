"use client";

import dynamic from "next/dynamic";
import  { useEffect, useState } from "react";


import { initLeafletIcons } from "@/lib/leaflet";

const MiniMap = dynamic(() => import("./Minimap"), { ssr: false });
const MapModal = dynamic(() => import("./MapModal"), { ssr: false });

const FIXED_LAT = 47.6548176;
const FIXED_LNG = -2.7065078;

const SingleMap = () => {
  const [open, setOpen] = useState(false);
   useEffect(() => {
    initLeafletIcons();
   }, []);
  
  return (
    <div className="relative z-10 my-12">
      <h2 className="mb-3 text-xl font-medium">
        Localisation :  36 Avenue Gontran Bienvenu 56000 Vannes
      </h2>
       <MiniMap
        lat={FIXED_LAT}
        lng={FIXED_LNG}
        onClick={() => setOpen(true)}
      />

      <MapModal
        open={open}
        onOpenChange={setOpen}
        lat={FIXED_LAT}
        lng={FIXED_LNG}
      />
    </div>
  );
};

export default SingleMap;
