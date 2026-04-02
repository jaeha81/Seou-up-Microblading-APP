"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// Fix default Leaflet marker icon paths (broken in Next.js/webpack)
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const FeaturedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl,
  shadowUrl,
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -38],
  shadowSize: [41, 41],
  className: "featured-marker",
});

export interface MapProvider {
  id: number;
  business_name: string;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  plan?: string;
}

interface ProvidersMapProps {
  providers: MapProvider[];
  locale: string;
  /** If set, centers the map on this provider and opens its popup */
  focusProviderId?: number;
  height?: string;
}

/** Auto-sets map bounds to fit all markers */
function FitBounds({ providers }: { providers: MapProvider[] }) {
  const map = useMap();

  useEffect(() => {
    const withCoords = providers.filter(
      (p): p is MapProvider & { latitude: number; longitude: number } =>
        p.latitude !== null && p.longitude !== null
    );
    if (withCoords.length === 0) return;

    if (withCoords.length === 1) {
      map.setView([withCoords[0].latitude, withCoords[0].longitude], 13);
      return;
    }

    const bounds = L.latLngBounds(
      withCoords.map((p) => [p.latitude, p.longitude])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, providers]);

  return null;
}

export default function ProvidersMap({
  providers,
  locale,
  focusProviderId,
  height = "420px",
}: ProvidersMapProps) {
  const withCoords = providers.filter(
    (p): p is MapProvider & { latitude: number; longitude: number } =>
      p.latitude !== null && p.longitude !== null
  );

  if (withCoords.length === 0) {
    return (
      <div
        className="w-full rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-sm"
        style={{ height }}
      >
        📍 No location data available yet
      </div>
    );
  }

  const center: [number, number] = focusProviderId
    ? (() => {
        const p = withCoords.find((p) => p.id === focusProviderId);
        return p ? [p.latitude, p.longitude] : [20, 100];
      })()
    : [20, 100];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={center}
        zoom={focusProviderId ? 14 : 3}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!focusProviderId && <FitBounds providers={withCoords} />}

        {withCoords.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            icon={p.plan === "featured" ? FeaturedIcon : DefaultIcon}
          >
            <Popup maxWidth={220}>
              <div className="py-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <strong className="text-sm text-stone-900">{p.business_name}</strong>
                  {p.is_verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                  {p.plan === "featured" && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                      ⭐
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mb-2">
                  {[p.city, p.country].filter(Boolean).join(", ")}
                </p>
                <a
                  href={`/${locale}/providers/${p.id}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View Profile →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
