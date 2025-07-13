/**
 * This file contains some generic reusable UI components, instead of using ShadCN
 * (for simplicity)
 */

import React from "react";
import clsx from "clsx";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  variant?: string;
  className?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = [
    "rounded px-4 py-2 transition-colors inline-flex items-center gap-2",
    "justify-center text-center hover:cursor-pointer hover:scale-105",
    "transition-transform duration-150",
  ];
  const variantClass =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-white border border-gray-200 text-blue-700 hover:bg-gray-100";
  return (
    <button className={clsx(base, variantClass, className)} {...props}>
      {children}
    </button>
  );
}

export function Spinner({
  className = "",
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full h-10 w-10 border-4 border-blue-500",
        "border-t-transparent",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className = "",
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-md border",
        "border-gray-300 p-5 flex flex-col gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
