"use client";

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "gold" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}
interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:  "bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-brand-400",
  secondary:"bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border border-stone-200 hover:border-stone-300 focus-visible:ring-stone-400",
  gold:     "bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-stone-900 shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-yellow-400",
  ghost:    "text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus-visible:ring-stone-400",
  danger:   "bg-red-500 hover:bg-red-400 text-white focus-visible:ring-red-400",
  outline:  "border border-white/25 hover:border-white/50 hover:bg-white/8 text-white focus-visible:ring-white/50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs rounded-xl gap-1.5",
  md: "px-6 py-3 text-sm rounded-2xl gap-2",
  lg: "px-8 py-4 text-base rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = [base, variantClasses[variant], sizeClasses[size], fullWidth ? "w-full" : "", className]
    .filter(Boolean).join(" ");

  const content = (
    <>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : leftIcon}
      {"children" in props && props.children}
      {!loading && rightIcon}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel, children, ...rest } = props as ButtonAsLink;
    void rest;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {loading && <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </Link>
    );
  }

  const { children, ...btnProps } = props as ButtonAsButton;
  return (
    <button {...btnProps} disabled={btnProps.disabled || loading} className={classes}>
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
