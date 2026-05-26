import React from "react";

type CardVariant = "default" | "premium" | "dark" | "hover" | "flat";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default:  "bg-white rounded-3xl border border-stone-100 shadow-sm",
  premium:  "bg-white rounded-3xl border border-stone-100 shadow-xl",
  dark:     "bg-stone-900 rounded-3xl border border-stone-800",
  hover:    "bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
  flat:     "bg-stone-50 rounded-2xl border border-stone-100",
};

export function Card({ variant = "default", className = "", children, onClick }: CardProps) {
  return (
    <div className={[variantClasses[variant], className].filter(Boolean).join(" ")} onClick={onClick}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  accent?: "brand" | "gold" | "green" | "blue";
}

const accentMap = {
  brand: { text: "text-brand-500", bg: "bg-brand-50", border: "border-brand-100" },
  gold:  { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
  green: { text: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  blue:  { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
};

export function StatCard({ label, value, delta, deltaPositive = true, icon, accent = "brand" }: StatCardProps) {
  const colors = accentMap[accent];
  return (
    <div className={`bg-white rounded-2xl border p-5 ${colors.border}`}>
      {icon && (
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
          <span className={colors.text}>{icon}</span>
        </div>
      )}
      <div className={`text-2xl font-bold ${colors.text} leading-none mb-1`}>{value}</div>
      <div className="text-sm text-stone-500 font-medium">{label}</div>
      {delta && (
        <div className={`text-xs font-semibold mt-2 ${deltaPositive ? "text-green-600" : "text-red-500"}`}>
          {deltaPositive ? "↑" : "↓"} {delta}
        </div>
      )}
    </div>
  );
}
