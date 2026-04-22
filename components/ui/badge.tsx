import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white",
        secondary: "bg-gray-600 text-white",
        destructive: "bg-red-600 text-white",
        outline: "border border-gray-500 text-white",
        ghost: "text-white hover:bg-gray-800",
        link: "text-indigo-400 underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };