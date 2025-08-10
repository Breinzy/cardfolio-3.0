"use client";
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export function Button({ variant = "default", className = "", ...props }: ButtonProps) {
  const base = "px-3 py-2 rounded text-sm";
  const theme =
    variant === "ghost"
      ? "bg-transparent text-white border border-white/20 hover:bg-white/10"
      : "bg-black text-white hover:opacity-90";
  return <button className={`${base} ${theme} ${className}`} {...props} />;
}


