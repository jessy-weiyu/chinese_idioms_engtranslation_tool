import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
        className
      )}
      {...props}
    />
  );
}
