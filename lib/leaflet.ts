export async function initLeafletIcons() {
  if (typeof window === "undefined") return;

  const L = await import("leaflet");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default as any).prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}
