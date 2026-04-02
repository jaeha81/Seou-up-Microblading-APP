"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { MapProvider } from "@/components/ProviderMap";

const ProviderMap = dynamic(() => import("@/components/ProviderMap"), { ssr: false });

interface Provider {
  id: number;
  business_name: string;
  city: string | null;
  country: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  is_verified: boolean;
  plan: string;
}

export default function ProvidersPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((data: Provider[]) => { setProviders(data); setLoading(false); });
  }, []);

  const mapProviders: MapProvider[] = providers.map((p) => ({
    id: p.id, business_name: p.business_name, city: p.city, country: p.country,
    latitude: p.latitude, longitude: p.longitude, is_verified: p.is_verified,
    phone: p.phone, website_url: p.website_url,
  }));

  const sorted = [...providers].sort((a, b) => {
    if (a.plan === "paid_plan" && b.plan !== "paid_plan") return -1;
    if (b.plan === "paid_plan" && a.plan !== "paid_plan") return 1;
    return 0;
  });

  const listToggleBase = "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ";
  const activeToggle = "bg-stone-900 text-white border-stone-900";
  const inactiveToggle = "bg-white text-stone-600 border-stone-200";

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">Directory</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Find Certified Providers</h1>
          <p className="text-stone-300 text-lg max-w-xl">Discover certified microblading studios near you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span><strong>Disclaimer</strong> — Seou-up does not certify providers. Always verify credentials before booking.</span>
        </div>

        {providers.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500"><strong className="text-stone-900">{providers.length}</strong> listed</span>
              <span className="text-stone-300">·</span>
              <span className="text-sm text-stone-500"><strong className="text-green-600">{providers.filter((p) => p.is_verified).length}</strong> verified</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowMap(false)} className={listToggleBase + (!showMap ? activeToggle : inactiveToggle)}>📋 List</button>
              <button onClick={() => setShowMap(true)} className={listToggleBase + (showMap ? activeToggle : inactiveToggle)}>🗺️ Map</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-stone-400">
            <div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-3" />
            Loading providers...
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">No providers listed yet</h2>
            <Link href={`/${locale}/auth/register`} className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl">📋 List Your Studio</Link>
          </div>
        ) : showMap ? (
          <div className="mb-10">
            <ProviderMap providers={mapProviders} locale={locale} height="500px" />
            <p className="text-xs text-stone-400 mt-2 text-center">Map &#169; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a></p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {sorted.map((p) => (
              <div key={p.id} className={"group bg-white rounded-2xl shadow-sm border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 " + (p.plan === "paid_plan" ? "border-yellow-200 ring-1 ring-yellow-100" : "border-stone-100")}>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-xl shrink-0">💄</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-stone-900 leading-tight">{p.business_name}</h3>
                        <div className="flex gap-1.5 shrink-0">
                          {p.plan === "paid_plan" && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>}
                          {p.is_verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Verified</span>}
                        </div>
                      </div>
                      <p className="text-sm text-stone-500 mt-0.5">{[p.city, p.country].filter(Boolean).join(", ") || "Location not listed"}</p>
                    </div>
                  </div>
                  {p.description && <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-50">
                    <div className="flex gap-3 flex-wrap">
                      {p.phone && <a href={`tel:${p.phone}`} className="text-xs text-stone-500 hover:text-brand-500">📞 {p.phone}</a>}
                      {p.website_url && <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-brand-500">🌐 Website</a>}
                      {p.instagram_url && <a href={p.instagram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-brand-500">📸 IG</a>}
                    </div>
                    <Link href={`/${locale}/providers/${p.id}`} className="shrink-0 text-xs font-semibold text-brand-600">View Profile →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-stone-900 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Are you a microblading professional?</h3>
          <p className="text-stone-400 text-sm mb-5">List free or upgrade to Featured for more visibility.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/auth/register`} className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl">📋 List Free →</Link>
            <Link href={`/${locale}/pricing`} className="inline-flex items-center gap-2 border border-yellow-400 text-yellow-300 font-semibold px-6 py-3 rounded-xl">⭐ Featured Plans →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
