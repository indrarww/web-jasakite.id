import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary", // 'primary' (orange) | 'secondary' (blue) | 'outline-blue' | 'outline-orange' | 'ghost' | 'danger'
  size = "md", // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  leftIcon,
  rightIcon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-brand-orange text-white hover:bg-brand-orange-hover shadow-sm hover:shadow-floating focus:ring-brand-orange",
    secondary:
      "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm focus:ring-brand-blue",
    "outline-blue":
      "border-2 border-brand-blue text-brand-blue bg-white hover:bg-brand-blue-light focus:ring-brand-blue",
    "outline-orange":
      "border-2 border-brand-orange text-brand-orange bg-white hover:bg-brand-orange-light focus:ring-brand-orange",
    ghost:
      "text-ink-main hover:bg-gray-100 hover:text-brand-blue focus:ring-gray-300",
    danger:
      "bg-status-error text-white hover:bg-red-700 shadow-sm focus:ring-red-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

