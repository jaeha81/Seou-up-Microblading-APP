"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
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
  created_at: string;
}

export default function ProviderDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const [provider, setProvider] = useState<Provider | null | "loading">("loading");

  useEffect(() => {
    fetch(`/api/providers/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => setProvider(data));
  }, [id]);

  if (provider === "loading") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-400">
        <div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-bold text-stone-900 text-xl mb-2">Provider not found</h2>
          <Link href={`/${locale}/providers`} className="text-brand-500 hover:underline text-sm">← Back to Providers</Link>
        </div>
      </div>
    );
  }

  const hasMap = provider.latitude != null && provider.longitude != null;
  const mapData: MapProvider[] = hasMap ? [{
    id: provider.id,
    business_name: provider.business_name,
    city: provider.city,
    country: provider.country,
    latitude: provider.latitude,
    longitude: provider.longitude,
    is_verified: provider.is_verified,
    phone: provider.phone,
    website_url: provider.website_url,
  }] : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href={`/${locale}/providers`}
          className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium mb-8 transition-colors"
        >
          ← Back to Providers
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-4xl shrink-0">💄</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-stone-900">{provider.business_name}</h1>
                  <p className="text-stone-500 mt-1">
                    {[provider.city, provider.country].filter(Boolean).join(", ") || "Location not listed"}
                  </p>
                  {provider.address && (
                    <p className="text-xs text-stone-400 mt-0.5">📍 {provider.address}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {provider.plan === "paid_plan" && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">⭐ Featured</span>
                  )}
                  {provider.is_verified && (
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">✓ Verified Provider</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            <strong>Disclaimer</strong> — Seou-up does not certify this provider.
            Always verify credentials and licenses before booking any procedure.
          </span>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {provider.phone && (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📞</div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Phone</p>
                <a href={`tel:${provider.phone}`} className="text-sm font-semibold text-stone-900 hover:text-brand-500 transition-colors">
                  {provider.phone}
                </a>
              </div>
            </div>
          )}
          {provider.website_url && (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">🌐</div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Website</p>
                <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-stone-900 hover:text-brand-500 truncate block">
                  {provider.website_url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}
          {provider.instagram_url && (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📸</div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Instagram</p>
                <a href={provider.instagram_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-stone-900 hover:text-brand-500">
                  View Profile
                </a>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📅</div>
            <div>
              <p className="text-xs text-stone-400 font-medium">Listed Since</p>
              <p className="text-sm font-semibold text-stone-900">
                {new Date(provider.created_at).toLocaleDateString(locale, { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {provider.description && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-stone-900 mb-3">About This Studio</h2>
            <p className="text-sm text-stone-600 leading-relaxed">{provider.description}</p>
          </div>
        )}

        {/* Map */}
        {hasMap && (
          <div className="mb-6">
            <h2 className="font-bold text-stone-900 mb-3">Location</h2>
            <ProviderMap providers={mapData} locale={locale} height="300px" singleMode />
            <p className="text-xs text-stone-400 mt-1">
              Map &#169; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-brand-500 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Interested in a consultation?</h3>
            <p className="text-brand-100 text-sm">Always verify credentials before booking.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {provider.phone && (
              <a href={`tel:${provider.phone}`} className="bg-white text-brand-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-stone-50 transition-colors">
                📞 Call
              </a>
            )}
            {provider.website_url && (
              <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="border border-white/40 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">
                🌐 Visit Site
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-stone-600 mb-3">Want to preview brow styles before your consultation?</p>
          <Link
            href={`/${locale}/simulate`}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            ✨ Try Brow Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
