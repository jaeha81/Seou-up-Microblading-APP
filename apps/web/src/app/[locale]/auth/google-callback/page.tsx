import { Suspense } from "react";
import GoogleCallbackClient from "./GoogleCallbackClient";

export const dynamic = "force-dynamic";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
