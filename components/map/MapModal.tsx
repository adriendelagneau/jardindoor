"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import "leaflet/dist/leaflet.css";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lat: number;
  lng: number;
};

export default function MapModal({ open, onOpenChange, lat, lng }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-w-4xl p-0">
        <DialogTitle className="sr-only">Map view</DialogTitle>
        <DialogDescription className="sr-only">
          Map showing the location of the listing
        </DialogDescription>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="h-full w-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} />
        </MapContainer>
      </DialogContent>
    </Dialog>
  );
}
