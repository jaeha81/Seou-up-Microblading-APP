import React from "react";

type BadgeVariant = "brand" | "gold" | "success" | "warning" | "error" | "neutral" | "info" | "pro";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand:   "bg-brand-100 text-brand-700 border border-brand-200",
  gold:    "bg-yellow-100 text-yellow-800 border border-yellow-200",
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-amber-100 text-amber-700 border border-amber-200",
  error:   "bg-red-100 text-red-700 border border-red-200",
  neutral: "bg-stone-100 text-stone-600 border border-stone-200",
  info:    "bg-blue-100 text-blue-700 border border-blue-200",
  pro:     "bg-gradient-to-r from-brand-500 to-brand-600 text-white border-0",
};

const dotColors: Record<BadgeVariant, string> = {
  brand:   "bg-brand-500",
  gold:    "bg-yellow-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error:   "bg-red-500",
  neutral: "bg-stone-400",
  info:    "bg-blue-500",
  pro:     "bg-white",
};

export function Badge({ variant = "neutral", size = "sm", dot = false, className = "", children }: BadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={[
      "inline-flex items-center gap-1.5 font-semibold rounded-full",
      sizeClass,
      variantClasses[variant],
      className,
    ].filter(Boolean).join(" ")}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} flex-shrink-0`} />}
      {children}
    </span>
  );
}

interface PlanBadgeProps {
  plan: "free" | "basic" | "pro" | "agency";
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  const config = {
    free:   { label: "Free",   variant: "neutral" as BadgeVariant },
    basic:  { label: "Basic",  variant: "info" as BadgeVariant },
    pro:    { label: "Pro",    variant: "pro" as BadgeVariant },
    agency: { label: "Agency", variant: "gold" as BadgeVariant },
  };
  const c = config[plan];
  return <Badge variant={c.variant} size="sm">{c.label}</Badge>;
}
