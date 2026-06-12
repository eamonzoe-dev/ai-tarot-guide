"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type TarotButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
};

const baseClasses =
  "inline-flex min-h-12 w-full touch-manipulation select-none items-center justify-center rounded-[1.35rem] border px-5 text-center text-xs font-semibold uppercase tracking-[0.18em] transition duration-200 active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-[#d2b06d]/45 focus:ring-offset-2 focus:ring-offset-[#050506] disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary:
    "border-[#d9bd80]/60 bg-[linear-gradient(180deg,rgba(35,27,17,0.88),rgba(8,7,6,0.96))] text-[#f5ead2] shadow-[0_14px_34px_rgba(0,0,0,0.44),0_0_24px_rgba(185,142,74,0.09),inset_0_1px_0_rgba(255,236,188,0.14),inset_0_-1px_0_rgba(0,0,0,0.72)] hover:border-[#efd08a] hover:text-white hover:shadow-[0_16px_38px_rgba(0,0,0,0.48),0_0_28px_rgba(214,179,109,0.15)]",
  ghost:
    "border-[#6d5a35]/70 bg-[linear-gradient(180deg,rgba(12,11,9,0.86),rgba(5,5,5,0.94))] text-[#d8c9ae] shadow-[0_10px_26px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,245,224,0.05)] hover:border-[#c7a463] hover:text-[#f4efe5]",
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
  const handleClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  if (href) {
    return (
      <Link
        aria-disabled={disabled}
        className={classes}
        href={href}
        onClick={handleClick}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
