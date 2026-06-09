"use client";

import Link from "next/link";

type TarotButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
};

const baseClasses =
  "inline-flex min-h-12 w-full touch-manipulation select-none items-center justify-center border px-5 text-center text-xs font-semibold uppercase tracking-[0.24em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#b89a68]/55 focus:ring-offset-2 focus:ring-offset-[#050506] disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "border-[#b08c58]/70 bg-[linear-gradient(180deg,#2a1d15,#120d0a)] text-[#f0eadf] shadow-[0_12px_28px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,235,204,0.12),inset_0_-1px_0_rgba(0,0,0,0.72)] hover:border-[#d0ad73] hover:bg-[linear-gradient(180deg,#332419,#17100c)]",
  ghost:
    "border-[#3f4e47] bg-[linear-gradient(180deg,#111715,#090b0a)] text-[#d7d0c2] shadow-[0_10px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[#7d927d] hover:text-[#f4efe5]",
};

export function TarotButton({
  children,
  href,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: TarotButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
