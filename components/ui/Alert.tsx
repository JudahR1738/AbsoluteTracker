import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "success" | "warning" | "info";
}

function Alert({ variant = "info", className, children, ...props }: AlertProps) {
  const variants = {
    error: "bg-red-950/50 border-red-800 text-red-300",
    success: "bg-green-950/50 border-green-800 text-green-300",
    warning: "bg-yellow-950/50 border-yellow-800 text-yellow-300",
    info: "bg-indigo-950/50 border-indigo-800 text-indigo-300",
  };

  return (
    <div role="alert" className={cn("rounded-lg border px-4 py-3 text-sm", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export { Alert };