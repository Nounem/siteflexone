import * as React from "react";
import { cn } from "../../lib/utils.ts";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "secondary";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "default" &&
          "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" &&
          "border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200",
        variant === "outline" && "text-gray-900 border-gray-300 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}

export { Badge };