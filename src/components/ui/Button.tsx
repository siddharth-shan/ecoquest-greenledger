"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-civic-primary text-white hover:bg-civic-primary-dark hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-civic-primary",
  secondary:
    "bg-civic-accent text-white hover:bg-civic-accent-dark hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-civic-accent",
  outline:
    "bg-transparent text-civic-primary border-2 border-civic-primary hover:bg-civic-primary hover:text-white focus-visible:ring-civic-primary",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-red-500",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-7 py-3 text-base rounded-lg gap-2.5",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          disabled &&
            "opacity-50 cursor-not-allowed pointer-events-none shadow-none translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
