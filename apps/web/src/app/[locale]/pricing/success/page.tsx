import Link from "next/link";

export default function PricingSuccessPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
          ✅
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-3">
          You are now Featured!
        </h1>
        <p className="text-stone-600 mb-2">
          Your studio listing has been upgraded to the <strong>Featured Pro</strong> plan.
        </p>
        <p className="text-stone-500 text-sm mb-8">
          Your listing will appear at the top of the provider directory with the ⭐ Featured badge.
          It may take a few minutes to reflect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={"/" + locale + "/providers"}
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            View Provider Directory
          </Link>
          <Link
            href={"/" + locale + "/profile"}
            className="inline-flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-xl transition-colors bg-white"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
