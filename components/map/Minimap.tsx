"use client";

import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lng: number;
  onClick: () => void;
};

export default function MiniMap({ lat, lng, onClick }: Props) {
  const center: LatLngExpression = [lat, lng];
  return (
    <div
      onClick={onClick}
      className="relative z-40 h-120 w-full cursor-pointer overflow-hidden rounded-lg"
    >
      <MapContainer
        center={center}
        zoom={12}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        preferCanvas={true}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>

      {/* Overlay click */}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  );
}
