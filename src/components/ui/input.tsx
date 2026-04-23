import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };