"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix Leaflet default icon paths for Next.js
const initLeafletIcons = () => {
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const verifiedIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapProvider {
  id: number;
  business_name: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  phone: string | null;
  website_url: string | null;
}

interface ProviderMapProps {
  providers: MapProvider[];
  locale: string;
  height?: string;
  singleMode?: boolean;
}

export default function ProviderMap({
  providers,
  locale,
  height = "400px",
  singleMode = false,
}: ProviderMapProps) {
  useEffect(() => {
    initLeafletIcons();
  }, []);

  const mapped = providers.filter((p) => p.latitude != null && p.longitude != null);

  if (mapped.length === 0) {
    return (
      <div
        className="rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-sm"
        style={{ height }}
      >
        📍 No location data available
      </div>
    );
  }

  const center: [number, number] = singleMode
    ? [mapped[0].latitude!, mapped[0].longitude!]
    : [
        mapped.reduce((s, p) => s + p.latitude!, 0) / mapped.length,
        mapped.reduce((s, p) => s + p.longitude!, 0) / mapped.length,
      ];

  const zoom = singleMode ? 15 : 4;

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapped.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude!, p.longitude!]}
            icon={verifiedIcon}
          >
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-stone-900 text-sm">{p.business_name}</span>
                  {p.is_verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mb-2">
                  {[p.city, p.country].filter(Boolean).join(", ")}
                </p>
                {p.phone && (
                  <a href={`tel:${p.phone}`} className="text-xs text-brand-500 block mb-1">
                    📞 {p.phone}
                  </a>
                )}
                {!singleMode && (
                  <Link
                    href={`/${locale}/providers/${p.id}`}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
