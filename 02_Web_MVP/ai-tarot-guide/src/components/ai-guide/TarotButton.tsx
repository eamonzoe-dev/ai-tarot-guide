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
  "btn w-full disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
  primary: "btn--primary",
  ghost: "btn--ghost",
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
