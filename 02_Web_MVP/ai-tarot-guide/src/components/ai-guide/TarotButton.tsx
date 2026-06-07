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
  "inline-flex min-h-12 w-full items-center justify-center border px-5 text-center text-xs font-semibold uppercase tracking-[0.24em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#668aa8]/60 focus:ring-offset-2 focus:ring-offset-[#050506] disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "border-[#6f8da3]/70 bg-[#16202a] text-[#f0eadf] shadow-[0_0_34px_rgba(83,119,145,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#9db6c8] hover:bg-[#1d2a36]",
  ghost:
    "border-[#3d4750] bg-[#101113]/70 text-[#d7d0c2] hover:border-[#6f879b] hover:text-[#f4efe5]",
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
